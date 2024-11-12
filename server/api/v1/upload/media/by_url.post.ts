import uploadFileToStorage from '~/server/utils/uploadFileToStorage'
import {
  ALLOWED_MEDIAFILE_MIME_TYPES,
  MEDIAFILE_MAX_SIZE,
  YOUTUBE_REGEX,
} from '~/utils/consts'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'
import { z, useSafeValidatedBody } from 'h3-zod'

export default defineApiRoute(
  async ({ event, supabase }) => {
    const body = await useSafeValidatedBody(
      event,
      z.object({
        url: z.string().url(),
      })
    )

    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: 'Заполните все необходимые поля',
      })
    }

    const url = body.data.url

    if (YOUTUBE_REGEX.test(url)) {
      throw createError({
        statusCode: 400,
        message: 'Некорректная ссылка',
      })
    }

    const blob = await $fetch<any | undefined>(url)

    if (!blob || !(blob instanceof Blob)) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось скачать медиафайл',
      })
    }

    const file = Buffer.from(await blob.arrayBuffer())

    const mimeType = await getMimeTypeFromBuffer(file)

    if (!mimeType || !ALLOWED_MEDIAFILE_MIME_TYPES.includes(mimeType)) {
      throw createError({
        statusCode: 400,
        message: 'Недопустимый формат медиафайла',
      })
    }

    if (file.length > MEDIAFILE_MAX_SIZE) {
      throw createError({
        statusCode: 400,
        message: 'Слишком большой медиафайл',
      })
    }

    return uploadFileToStorage({ supabase, file })
  },
  { requireAuth: true }
)
