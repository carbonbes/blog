import tmp from 'tmp'
import { createWriteStream, createReadStream, statSync } from 'fs'
import getFileTypeFromMimeType from '~/utils/getFileTypeFromMimeType'

export default defineApiRoute(async ({ event, supabase }) => {
  const mediaName = getRouterParam(event, 'name')

  if (!mediaName)
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })

  const { data: dbFile, error: dbFileError } = await supabase
    .from('media_files')
    .select('name, mime_type')
    .eq('name', mediaName)
    .single()

  if (dbFileError || !dbFile)
    throw createError({
      statusCode: 404,
      message: 'Не удалось найти медиафайл',
    })

  const type = getFileTypeFromMimeType(dbFile.mime_type)

  if (type === 'image' || !type)
    throw createError({
      statusCode: 400,
      message: 'Запрашиваемый медиафайл не является видео',
    })

  const { data: storageFile, error: storageFileError } = await supabase.storage
    .from('media')
    .download(mediaName)

  if (!storageFile || storageFileError)
    throw createError({
      statusCode: 404,
      message: 'Не удалось загрузить медиафайл',
    })

  return new Promise((resolve, reject) => {
    tmp.file(async (error, path, fd, cleanupCallback) => {
      if (error) {
        reject(error)
        return
      }

      try {
        const buffer = Buffer.from(await storageFile.arrayBuffer())

        const writeStream = createWriteStream(path)
        writeStream.write(buffer)
        writeStream.end()

        writeStream.on('error', (writeError) => {
          reject(
            createError({
              statusCode: 500,
              message: 'Внутренняя ошибка сервера',
            })
          )
        })

        writeStream.on('finish', async () => {
          const fileSize = statSync(path).size
          const range = getRequestHeader(event, 'range') || `bytes=0-`

          const parts = range.replace(/bytes=/, '').split('-')
          const start = parseInt(parts[0], 10)
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

          if (start >= fileSize || end >= fileSize) {
            reject(
              createError({
                statusCode: 416,
                message: 'Запрашиваемый диапазон не допустим',
              })
            )
            return
          }

          const chunksize = end - start + 1
          const fileStream = createReadStream(path, { start, end })

          setResponseStatus(event, 206)
          appendHeaders(event, {
            'Content-Type': dbFile.mime_type,
            'Content-Length': chunksize.toString(),
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
          })

          fileStream.on('end', () => {
            cleanupCallback()
            resolve(true)
          })

          await sendStream(event, fileStream)
        })
      } catch (error) {
        reject(
          createError({
            statusCode: 500,
            message: 'Внутренняя ошибка сервера',
          })
        )
      }
    })
  })
})
