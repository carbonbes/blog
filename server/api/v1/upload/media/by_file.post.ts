import {
  ALLOWED_MEDIAFILE_MIME_TYPES,
  MEDIAFILE_MAX_SIZE,
} from '~/utils/consts'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'
import getFileTypeFromMimeType from '~/utils/getFileTypeFromMimeType'
import uploadImageToStorage from '~/server/utils/uploadImageToStorage'
import uploadVideoToStorage from '~/server/utils/uploadVideoToStorage'

export default defineApiEndpoint(
  async ({ event, supabase }) => {
    const formData = await readMultipartFormData(event)

    if (!formData)
      throw createError({
        statusCode: 400,
        message: 'Прикрепите медиафайл',
      })

    const files = formData.filter((item) => item.name === 'file')

    if (files.length > 1)
      throw createError({
        statusCode: 400,
        message: 'За раз загрузить можно только один медиафайл',
      })

    const file = files[0].data

    if (file.length === 0)
      throw createError({
        statusCode: 404,
        message: 'Медиафайл не обнаружен',
      })

    const fileMimetype = await getMimeTypeFromBuffer(file)

    if (!fileMimetype)
      throw createError({
        statusCode: 400,
        message: 'Не удалось распознать тип медиафайла',
      })

    if (!ALLOWED_MEDIAFILE_MIME_TYPES.includes(fileMimetype))
      throw createError({
        statusCode: 400,
        message: 'Недопустимый формат медиафайла',
      })

    if (file.length > MEDIAFILE_MAX_SIZE)
      throw createError({
        statusCode: 400,
        message: 'Слишком большой медиафайл',
      })

    const description = formData
      .find((item) => item.name === 'description')
      ?.data.toString()

    const type = getFileTypeFromMimeType(fileMimetype)

    if (type === 'image') {
      return await uploadImageToStorage({ supabase, image: file, description })
    } else if (type === 'video') {
      return await uploadVideoToStorage({ supabase, video: file, description })
    }
  },
  { requireAuth: true }
)
