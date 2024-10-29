import getSlug from '~/server/utils/getSlug'
import { z, useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import articleBodySchema from '~/server/schema/articleBodySchema'
import getArticleTitle from '~/server/utils/getArticleTitle'

export default defineApiRoute(
  async ({ event, supabase, user: { name: userName } }) => {
    const params = await useSafeValidatedParams(event, { id: z.string() })

    if (!params.success) {
      throw createError({
        statusCode: 400,
        message: 'Укажите ID записи',
      })
    }

    const body = await useSafeValidatedBody(
      event,
      z.object({ body: articleBodySchema })
    )

    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось обновить запись',
      })
    }

    const id = params.data.id
    const articleBody = body.data.body

    const title = getArticleTitle(articleBody) || `Запись пользователя ${userName}`
    const titleSlug = getSlug(title)

    const { data, error } = await supabase
      .from('articles')
      .update({
        title,
        title_slug: titleSlug,
        body: articleBody,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: +error.code,
        message: error.message,
      })
    }

    return data
  },
  { requireAuth: true }
)
