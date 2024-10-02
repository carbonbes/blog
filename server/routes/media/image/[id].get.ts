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

  const { data: file } = await supabase
    .from('mediafiles')
    .select('storage_path')
    .eq('media_id', mediaId)
    .single()

  if (!file)
    throw createError({
      statusCode: 404,
      message: 'Не удалось найти медиафайл',
    })

  const {
    data: { publicUrl },
  } = supabase.storage.from('media').getPublicUrl(file.storage_path)

  const { data: blobFile, error } = await supabase.storage
    .from('media')
    .download(publicUrl, { transform })

  return error

  const buffer = await blobFile?.arrayBuffer()

  return blobFile
})
