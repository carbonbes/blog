import uploadImageToStorage from '~/server/utils/uploadImageToStorage'
import uploadVideoToStorage from '~/server/utils/uploadVideoToStorage'
import {
  ALLOWED_MEDIAFILE_MIME_TYPES,
  MEDIAFILE_MAX_SIZE,
  YOUTUBE_REGEX,
} from '~/utils/consts'
import getFileTypeFromMimeType from '~/utils/getFileTypeFromMimeType'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'

export default defineApiRoute(
  async ({ event, supabase }) => {
    const { url }: { url: string } = await readBody(event)

    if (!url)
      throw createError({
        statusCode: 400,
        message: 'Заполните все необходимые поля',
      })

    if (YOUTUBE_REGEX.test(url))
      throw createError({
        statusCode: 400,
        message: 'Некорректная ссылка',
      })

    const blob = await $fetch<any | undefined>(url)

    if (!blob || !(blob instanceof Blob))
      throw createError({
        statusCode: 400,
        message: 'Не удалось скачать медиафайл',
      })

    const file = Buffer.from(await blob.arrayBuffer())

    const mimeType = await getMimeTypeFromBuffer(file)

    if (!mimeType)
      throw createError({
        statusCode: 400,
        message: 'Не удалось распознать тип медиафайла',
      })

    if (!ALLOWED_MEDIAFILE_MIME_TYPES.includes(mimeType))
      throw createError({
        statusCode: 400,
        message: 'Недопустимый формат медиафайла',
      })

    if (file.length > MEDIAFILE_MAX_SIZE)
      throw createError({
        statusCode: 400,
        message: 'Слишком большой медиафайл',
      })

    const type = getFileTypeFromMimeType(mimeType)

    if (type === 'image') {
      return await uploadImageToStorage({ supabase, image: file })
    } else if (type === 'video') {
      return await uploadVideoToStorage({ supabase, video: file })
    }
  },
  { requireAuth: true }
)
