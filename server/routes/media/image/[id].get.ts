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

  const { data: blobFile, error: blobFileError } = await supabase.storage
    .from('media')
    .download(fileData.storage_path)

  if (!blobFile || blobFileError)
    throw createError({
      statusCode: 404,
      message: 'Не удалось найти медиафайл',
    })

  const buffer = await blobFile.arrayBuffer()

  appendHeader(event, 'Content-Type', 'image/jpeg')

  return buffer
})
