import tmp from 'tmp'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

export default async function getVideoMetadata(file: Buffer): Promise<{
  width: number
  height: number
  duration: number
}> {
  return new Promise((resolve, reject) => {
    tmp.file((err, path, fd, cleanupCallback) => {
      if (err) {
        reject(err)
        throw createError({
          message: `Ошибка создания временного файла: ${err.message}`,
        })
      }

      fs.writeFile(path, file, (writeErr) => {
        if (writeErr) {
          cleanupCallback()
          reject(writeErr)
          throw createError({
            message: `Ошибка записи в файл: ${writeErr.message}`,
          })
        }

        ffmpeg.ffprobe(path, (probeErr, data) => {
          cleanupCallback()

          if (probeErr) {
            reject(probeErr)
            throw createError({
              message: `Ошибка получения метаданных видео: ${probeErr.message}`,
            })
          }

          const { width, height, duration } = data.streams[0]

          if (!width || !height || !duration) {
            throw createError({
              message: `Ошибка получения метаданных видео: отсутствуют необходимые данные`,
            })
          }

          resolve({
            width,
            height,
            duration: +duration,
          })
        })
      })
    })
  })
}
