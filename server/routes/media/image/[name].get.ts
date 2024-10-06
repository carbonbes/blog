import { Readable } from 'stream'
import getFileTypeFromMimeType from '~/utils/getFileTypeFromMimeType'
import { MimeType } from 'file-type'

export default defineApiRoute(async ({ event, supabase }) => {
  const mediaName = getRouterParam(event, 'name')
  const transform: ImageTransformOptions = getQuery(event)

  if (!mediaName)
    throw createError({
      statusCode: 400,
      message: 'Укажите id медиафайла',
    })

  const { data: fileData, error: fileDataError } = await supabase
    .from('media_files')
    .select('name, mime_type')
    .eq('name', mediaName)
    .single()

  if (fileDataError || !fileData)
    throw createError({
      statusCode: 404,
      message: 'Не удалось найти медиафайл',
    })

  const mimeType = fileData.mime_type as MimeType

  const type = getFileTypeFromMimeType(mimeType)

  if (type === 'video' || !type)
    throw createError({
      statusCode: 400,
      message: 'Запрашиваемый медиафайл не является картинкой',
    })

  const { data: storageFile, error: storageFileError } = await supabase.storage
    .from('media')
    .download(mediaName, {
      transform: mimeType !== 'image/gif' ? transform : undefined,
    })

  if (!storageFile || storageFileError)
    throw createError({
      statusCode: 404,
      message: 'Не удалось загрузить медиафайл',
    })

  const arrayBuffer = await storageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const stream = new Readable({
    read() {
      this.push(buffer)
      this.push(null)
    },
  })

  appendHeaders(event, {
    'Content-Type': mimeType,
    'Cache-Control': 'max-age=3600',
    'Content-Length': Buffer.byteLength(buffer).toString(),
  })

  return await sendStream(event, stream)
})
