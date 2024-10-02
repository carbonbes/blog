import { createReadStream, statSync } from 'fs'

export default defineApiEndpoint(async ({ event, supabase }) => {
  const mediaId = getRouterParam(event, 'id')

  if (!mediaId)
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })

  const { data: file, error } = await supabase
    .from('mediafiles')
    .select('path, mime_type')
    .eq('media_id', mediaId)
    .single()

  if (error || !file)
    throw createError({
      statusCode: 404,
      message: 'Не удалось найти медиафайл',
    })

  const stat = statSync(file.path)
  const fileSize = stat.size

  const range = event.req.headers.range

  if (!range) {
    event.node.res.writeHead(416, {
      'Content-Range': `bytes */${fileSize}`,
    })
    return
  }

  const parts = range.replace(/bytes=/, '').split('-')
  const start = parseInt(parts[0], 10)
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

  event.node.res.writeHead(206, {
    'Content-Type': file.mime_type,
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Content-Length': end - start + 1,
  })

  const readStream = createReadStream(file.path, { start, end })

  return sendStream(event, readStream)
})
