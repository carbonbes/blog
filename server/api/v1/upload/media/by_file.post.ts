import { MimeType } from 'file-type'
import { readFiles } from 'h3-formidable'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { PassThrough } from 'stream'
import {
  ALLOWED_MEDIAFILE_MIME_TYPES,
  MEDIAFILE_MAX_SIZE,
} from '~/utils/consts'
import getBufferFromFile from '~/utils/getBufferFromFile'

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
      }

      resolve({
        width: data.streams[0].width,
        height: data.streams[0].height,
        duration: data.streams[0].duration,
      })
    })
  })
}

async function getScreenshotFromVideo(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const bufferStream = new PassThrough()
    const chunks: Buffer[] = []

    ffmpeg(path)
      .on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      .on('error', (error) => {
        reject(error)
      })
      .screenshot({
        count: 1,
        timestamps: ['50%'],
      })
      .format('png')
      .pipe(bufferStream)

    bufferStream.on('data', (chunk) => {
      chunks.push(chunk)
    })
  })
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

    const buffer = await getBufferFromFile(file.filepath)

    const { data, error } = await supabase.storage
      .from('media')
      .upload(file.newFilename, buffer, { contentType: file.mimetype })

    if (error)
      throw createError({
        statusCode: 400,
        message: error.message,
      })

    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(data.path)

    const type = getFileTypeFromMimeType(file.mimetype as MimeType)

    if (type === 'image') {
      const { width, height } = await sharp(file.filepath).metadata()

      const { data, error } = await supabase
        .from('mediafiles')
        .insert({
          url: publicUrl,
          width,
          height,
          description: description?.[0],
          mime_type: file.mimetype,
        })
        .select('url, width, height, description, mime_type')
        .single()

      if (error)
        throw createError({
          statusCode: +error.code,
          message: error.message,
        })

      return data
    } else if (type === 'video') {
      // const { width, height, duration } = await getVideoMetadata(file.filepath)
      const thumbnailBuffer = await getScreenshotFromVideo(file.filepath)

      return thumbnailBuffer
    }
  },
  { requireAuth: true }
)
