import tmp from 'tmp'
import fs from 'fs'
import { PassThrough } from 'stream'
import ffmpeg from 'fluent-ffmpeg'

export default async function getScreenshotFromVideo(
  file: Buffer
): Promise<Buffer> {
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
