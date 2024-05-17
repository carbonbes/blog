import isValidImageURL from '~/utils/isValidImageURL'

export default defineApiEndpoint(
  async ({ event }) => {
    const { url } = await readBody(event)

    if (!url)
      throw createError({
        statusCode: 400,
        message: 'Заполните все необходимые поля',
      })

    if (!isValidImageURL(url))
      throw createError({
        statusCode: 400,
        message: 'Неподдерживаемый формат медиа-файла',
      })

    const { upload } = useCdn()

    return await upload(url)
  },
  { requireAuth: true }
)
