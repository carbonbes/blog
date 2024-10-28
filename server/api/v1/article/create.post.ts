import getSlug from '~/server/utils/getSlug'
import { useSafeValidatedBody } from 'h3-zod'
import articleBodySchema from '~/server/schema/articleBodySchema'
import getArticleTitle from '~/server/utils/getArticleTitle'

export default defineApiRoute(
  async ({ event, supabase, user: { name: userName } }) => {
    const body = await useSafeValidatedBody(event, articleBodySchema)

    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось создать запись',
      })
    }

    const articleBody = body.data

    const title = getArticleTitle(articleBody) || `Запись пользователя ${userName}`
    const titleSlug = getSlug(title)

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        title_slug: titleSlug,
        body: articleBody,
      })
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
