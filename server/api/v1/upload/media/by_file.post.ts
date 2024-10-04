import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { PassThrough } from 'stream'
import {
  ALLOWED_MEDIAFILE_MIME_TYPES,
  MEDIAFILE_MAX_SIZE,
} from '~/utils/consts'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'
import tmp from 'tmp'
import fs from 'fs'
import getFileTypeFromMimeType from '~/utils/getFileTypeFromMimeType'
import { MimeType } from 'file-type'

async function getVideoMetadata(file: Buffer): Promise<{
  width: number
  height: number
  duration: number
}> {
  return new Promise((resolve, reject) => {
    tmp.file((err, path, fd, cleanupCallback) => {
      if (err) {
        reject(err)
        throw createError({
          message: `Ошибка создания временного файла: ${err.message}`,
        })
      }

      fs.writeFile(path, file, (writeErr) => {
        if (writeErr) {
          cleanupCallback()
          reject(writeErr)
          throw createError({
            message: `Ошибка записи в файл: ${writeErr.message}`,
          })
        }

        ffmpeg.ffprobe(path, (probeErr, data) => {
          cleanupCallback()

          if (probeErr) {
            reject(probeErr)
            throw createError({
              message: `Ошибка получения метаданных видео: ${probeErr.message}`,
            })
          }

          const { width, height, duration } = data.streams[0]

          if (!width || !height || !duration) {
            throw createError({
              message: `Ошибка получения метаданных видео: отсутствуют необходимые данные`,
            })
          }

          resolve({
            width,
            height,
            duration: +duration,
          })
        })
      })
    })
  })
}

async function getScreenshotFromVideo(file: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    tmp.file(async (err, path, fd, cleanupCallback) => {
      if (err)
        return reject(
          createError({
            message: `Ошибка создания временного файла: ${err.message}`,
          })
        )

      try {
        fs.writeFile(path, file, (error) => {
          if (error) throw err

          const bufferStream = new PassThrough()
          const chunks: Buffer[] = []

          ffmpeg(path)
            .outputFormat('image2pipe')
            .frames(1)
            .on('error', (error) => {
              reject(error)

              throw createError({
                message: `Ошибка получения скриншота видео: ${error.message}`,
              })
            })
            .on('end', () => {
              resolve(Buffer.concat(chunks))
            })
            .pipe(bufferStream)

          bufferStream.on('data', (chunk) => {
            chunks.push(chunk)
          })

          bufferStream.on('end', () => {
            resolve(Buffer.concat(chunks))
          })
        })
      } catch (error: any) {
        cleanupCallback()
        reject(
          createError({
            message: `Ошибка записи во временный файл: ${error.message}`,
          })
        )
      }
    })
  })
}

export default defineApiEndpoint(
  async ({ event, supabase }) => {
    async function upload(path: string, file: Buffer, mimeType: MimeType) {
      const {
        public: { imageRoute, videoRoute },
      } = useRuntimeConfig()

      try {
        const { data: storageFile, error } = await supabase.storage
          .from('media')
          .upload(path, file, { contentType: mimeType })

        if (error)
          throw createError({
            message: `Ошибка загрузки медиафайла: ${error.message}`,
          })

        if (!storageFile)
          throw createError({ message: 'Не удалось загрузить медиафайл' })

        const type = getFileTypeFromMimeType(mimeType)!

        return { url: (type === 'image' ? imageRoute : videoRoute) + path }
      } catch (error: any) {
        throw createError({
          status: 400,
          message: 'Ошибка загрузки медиафайла',
        })
      }
    }

    const formData = await readMultipartFormData(event)

    if (!formData)
      throw createError({
        statusCode: 400,
        message: 'Прикрепите медиафайл',
      })

    const files = formData.filter((item) => item.name === 'file')

    if (files.length > 1)
      throw createError({
        statusCode: 400,
        message: 'За раз загрузить можно только один медиафайл',
      })

    const file = files[0].data

    if (file.length === 0)
      throw createError({
        statusCode: 404,
        message: 'Медиафайл не обнаружен',
      })

    const fileName = crypto.randomUUID()
    const fileMimetype = await getMimeTypeFromBuffer(file)

    if (!fileMimetype)
      throw createError({
        statusCode: 400,
        message: 'Не удалось распознать тип медиафайла',
      })

    if (!ALLOWED_MEDIAFILE_MIME_TYPES.includes(fileMimetype))
      throw createError({
        statusCode: 400,
        message: 'Недопустимый формат медиафайла',
      })

    if (file.length > MEDIAFILE_MAX_SIZE)
      throw createError({
        statusCode: 400,
        message: 'Слишком большой медиафайл',
      })

    const description = formData
      .find((item) => item.name === 'description')
      ?.data.toString()

    const type = getFileTypeFromMimeType(fileMimetype)

    if (type === 'image') {
      const { url } = await upload(fileName, file, fileMimetype)
      const { width, height } = await sharp(file).metadata()

      const { data, error } = await supabase
        .from('media_files')
        .insert({
          name: fileName,
          url,
          width,
          height,
          mime_type: fileMimetype,
          description,
        })
        .select('name, url, width, height, mime_type, description')
        .single()

      if (error)
        throw createError({
          statusCode: +error.code,
          message: error.message,
        })

      return data
    } else if (type === 'video') {
      const thumbnailBuffer = await getScreenshotFromVideo(file)
      const thumbnailMimetype = await getMimeTypeFromBuffer(thumbnailBuffer)

      if (!thumbnailMimetype)
        throw createError({
          statusCode: 400,
          message: 'Не удалось распознать тип у превью видео',
        })

      const {
        width: videoWidth,
        height: videoHeight,
        duration,
      } = await getVideoMetadata(file)

      const { width: thumbnailWidth, height: thumbnailHeight } = await sharp(
        thumbnailBuffer
      ).metadata()

      const thumbnailName = crypto.randomUUID()

      const [{ url: videoUrl }, { url: thumbnailUrl }] = await Promise.all([
        upload(fileName, file, fileMimetype),
        upload(thumbnailName, thumbnailBuffer, thumbnailMimetype),
      ])

      const { data: thumbnailData, error: thumbnailDataError } = await supabase
        .from('media_files')
        .insert({
          name: thumbnailName,
          url: thumbnailUrl,
          width: thumbnailWidth,
          height: thumbnailHeight,
          mime_type: thumbnailMimetype,
        })
        .select('id')
        .single()

      if (thumbnailDataError)
        throw createError({
          statusCode: +thumbnailDataError.code,
          message: thumbnailDataError.message,
        })

      const { data, error } = await supabase
        .from('media_files')
        .insert({
          name: fileName,
          url: videoUrl,
          thumbnail: thumbnailData.id,
          width: videoWidth,
          height: videoHeight,
          duration,
          mime_type: fileMimetype,
          description,
        })
        .select(
          `
          name,
          url,
          thumbnail (
            name,
            url,
            width,
            height,
            mime_type
          ),
          width,
          height,
          duration,
          mime_type,
          description
        `
        )
        .single()

      if (error)
        throw createError({
          statusCode: +error.code,
          message: error.message,
        })

      return data
    }
  },
  { requireAuth: true }
)
