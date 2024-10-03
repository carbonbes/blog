import { Readable } from 'stream'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'
import { GifCodec } from 'gifwrap'

type TransformOptions =
  | {
      width?: number
      height?: number
      resize?: 'cover' | 'contain' | 'fill'
      quality?: number
      format?: 'origin'
    }
  | undefined

export default defineApiEndpoint(async ({ event, supabase }) => {
  const mediaId = getRouterParam(event, 'id')
  const transform: TransformOptions = getQuery(event)

  if (!mediaId)
    throw createError({
      statusCode: 400,
      message: 'Укажите id медиафайла',
    })

  const { data: fileData, error: fileDataError } = await supabase
    .from('media_files')
    .select('name')
    .eq('name', mediaId)
    .single()

  if (!fileData || fileDataError)
    throw createError({
      statusCode: 404,
      message: 'Не удалось найти медиафайл',
    })

  const { data: storageFile, error: storageFileError } = await supabase.storage
    .from('media')
    .download(mediaId, { transform })

  if (!storageFile || storageFileError)
    throw createError({
      statusCode: 404,
      message: 'Не удалось загрузить медиафайл',
    })

  const arrayBuffer = await storageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const mimeType = await getMimeTypeFromBuffer(buffer)

  let finalBuffer

  if (!mimeType)
    throw createError({
      statusCode: 400,
      message: 'Не удалось распознать тип медиафайла',
    })

  if (mimeType === 'image/gif') {
    const gifCodec = new GifCodec()
    const gif = await gifCodec.decodeGif(buffer)

    const encodedGif = await gifCodec.encodeGif(gif.frames, { loops: 0 })

    finalBuffer = encodedGif.buffer
  } else {
    finalBuffer = buffer
  }

  const stream = new Readable({
    read() {
      this.push(finalBuffer)
      this.push(null)
    },
  })

  appendHeaders(event, {
    'Content-Type': mimeType,
    'Cache-Control': 'max-age=3600',
    'Content-Length': Buffer.byteLength(finalBuffer).toString(),
  })

  return await sendStream(event, stream)
})
