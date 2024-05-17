import { readFiles } from 'h3-formidable'
import useCdn from '~/server/utils/useCdn'

export default defineApiEndpoint(
  async ({ event }) => {
    const { files } = await readFiles(event)

    if (!Object.keys(files).length)
      throw createError({ statusCode: 400, message: 'Прикрепите файлы' })

    const { file: _files } = files

    if (_files!.length > 1)
      throw createError({
        statusCode: 400,
        message: 'Максимум можно загрузить за раз только один файл',
      })

    const file = files.file![0]

    const isImage = file.mimetype?.startsWith('image')
    const isVideo = file.mimetype?.startsWith('video')

    if (!(isImage || isVideo))
      throw createError({
        statusCode: 400,
        message: 'Неверный формат медиа-файла',
      })

    if (file.size > 1024 * 1024 * 5)
      throw createError({ statusCode: 400, message: 'Слишком большой файл' })

    const { upload } = useCdn()

    return await upload(file.filepath)
  },
  { requireAuth: true }
)
