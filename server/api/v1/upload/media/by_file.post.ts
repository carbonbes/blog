import { MimeType } from 'file-type'
import { readFiles } from 'h3-formidable'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { PassThrough } from 'stream'
import {
  ALLOWED_MEDIAFILE_MIME_TYPES,
  IMAGE_ROUTE,
  MEDIAFILE_MAX_SIZE,
  VIDEO_ROUTE,
} from '~/utils/consts'
import getBufferFromFile from '~/utils/getBufferFromFile'
import { Supabase } from '~/types'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'

function getFileTypeFromMimeType(mimeType: MimeType) {
  if (mimeType.startsWith('image/')) {
    return 'image'
  } else if (mimeType.startsWith('video/')) {
    return 'video'
  }
}

async function getVideoMetadata(path: string): Promise<{
  width: number | undefined
  height: number | undefined
  duration: string | undefined
}> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (error, data) => {
      if (error) {
        reject(error)

        throw createError({
          message: `Ошибка получения метаданных видео: ${error.message}`,
        })
      }

      const { width, height, duration } = data.streams[0]

      resolve({
        width,
        height,
        duration,
      })
    })
  })
}

async function getScreenshotFromVideo(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
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
}

async function upload(
  supabase: Supabase,
  path: string,
  file: Buffer,
  contentType: string
) {
  try {
    const { data: storageFile, error } = await supabase.storage
      .from('media')
      .upload(path, file, { contentType })

    if (error)
      throw createError({
        message: `Ошибка загрузки медиафайла: ${error.message}`,
      })

    if (!storageFile)
      throw createError({ message: 'Не удалось загрузить медиафайл' })

    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(storageFile.path)

    return { url: publicUrl, storageFilePath: storageFile.path }
  } catch (err: any) {
    throw createError({})
  }
}

export default defineApiEndpoint(
  async ({ event, supabase }) => {
    const {
      files: filesList,
      fields: { description },
    } = await readFiles(event)

    if (!Object.keys(filesList).length)
      throw createError({ statusCode: 400, message: 'Прикрепите медиафайл' })

    const { file: files } = filesList

    if (!files)
      throw createError({
        statusCode: 400,
        message: 'Медиафайл не обнаружен',
      })

    if (files.length > 1)
      throw createError({
        statusCode: 400,
        message: 'Максимум можно загрузить за раз только один медиафайл',
      })

    const [file] = files

    if (!file.mimetype)
      throw createError({
        statusCode: 400,
        message: 'Не удалось распознать тип медиафайла',
      })

    if (!ALLOWED_MEDIAFILE_MIME_TYPES.includes(file.mimetype as MimeType))
      throw createError({
        statusCode: 400,
        message: 'Неверный формат медиафайла',
      })

    if (file.size > MEDIAFILE_MAX_SIZE)
      throw createError({
        statusCode: 400,
        message: 'Слишком большой медиафайл',
      })

    const type = getFileTypeFromMimeType(file.mimetype as MimeType)

    if (type === 'image') {
      const buffer = await getBufferFromFile(file.filepath)

      const { storageFilePath } = await upload(
        supabase,
        file.newFilename,
        buffer,
        file.mimetype
      )

      const media_id = crypto.randomUUID()
      const url = IMAGE_ROUTE + media_id
      const { width, height } = await sharp(file.filepath).metadata()

      const { data, error } = await supabase
        .from('mediafiles')
        .insert({
          media_id,
          storage_path: storageFilePath,
          url,
          width,
          height,
          mime_type: file.mimetype,
          description: description?.[0],
        })
        .select('url, width, height, mime_type, description')
        .single()

      if (error)
        throw createError({
          statusCode: +error.code,
          message: error.message,
        })

      return data
    } else if (type === 'video') {
      const videoBuffer = await getBufferFromFile(file.filepath)
      const thumbnailBuffer = await getScreenshotFromVideo(file.filepath)
      const thumbnailMimetype = await getMimeTypeFromBuffer(thumbnailBuffer)

      if (!thumbnailMimetype)
        throw createError({
          statusCode: 400,
          message: 'Не удалось распознать тип у превью видео',
        })

      const media_id = crypto.randomUUID()
      const url = VIDEO_ROUTE + media_id

      const { storageFilePath } = await upload(
        supabase,
        file.newFilename,
        videoBuffer,
        file.mimetype
      )

      const thumbnailUrl = await upload(
        supabase,
        file.newFilename + '_thumb',
        thumbnailBuffer,
        thumbnailMimetype
      )

      const { width, height, duration } = await getVideoMetadata(file.filepath)

      const { data, error } = await supabase
        .from('mediafiles')
        .insert({
          media_id,
          url,
          storage_path: storageFilePath,
          thumbnail: thumbnailUrl,
          width,
          height,
          duration: +duration!,
          mime_type: file.mimetype,
          description: description?.[0],
        })
        .select(
          'media_id, url, thumbnail, width, height, duration, mime_type, description'
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
