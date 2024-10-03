import { Readable } from 'stream'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'

interface TransformOptions {
  width?: number
  height?: number
  resize?: 'cover' | 'contain' | 'fill'
  quality?: number
  format?: 'origin'
}

export default defineApiEndpoint(async ({ event, supabase }) => {
  const mediaId = getRouterParam(event, 'id')
  const transform: TransformOptions | undefined = getQuery(event)

  if (!mediaId)
    throw createError({
      statusCode: 400,
      message: 'Укажите id медиафайла',
    })

  const { data: fileData, error: fileDataError } = await supabase
    .from('mediafiles')
    .select('storage_path')
    .eq('media_id', mediaId)
    .single()

  if (!fileData || fileDataError)
    throw createError({
      statusCode: 404,
      message: 'Не удалось найти медиафайл',
    })

  const { data: storageFile, error: storageFileError } = await supabase.storage
    .from('media')
    .download(fileData.storage_path, { transform })

  if (!storageFile || storageFileError)
    throw createError({
      statusCode: 404,
      message: 'Не удалось найти медиафайл',
    })

  const arrayBuffer = await storageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const mimeType = await getMimeTypeFromBuffer(buffer)

  if (!mimeType)
    throw createError({
      statusCode: 400,
      message: 'Не удалось распознать тип медиафайла',
    })

  const stream = new Readable({
    read() {
      this.push(buffer)
      this.push(null)
    },
  })

  appendHeaders(event, {
    'Content-Type': mimeType,
    'Cache-Control': 'max-age=3600',
    'Content-Length': Buffer.byteLength(buffer).toString()
  })

  return await sendStream(event, stream)
})
