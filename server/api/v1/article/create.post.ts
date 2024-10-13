import getSlug from '~/utils/getSlug'
import { useSafeValidatedBody } from 'h3-zod'
import articleBodySchema from '~/server/schema/articleBodySchema'
import findTitle from '~/server/utils/findTitle'
import { ArticleBody } from '~/types'

export default defineApiRoute(
  async ({ event, supabase, user }) => {
    const body = await useSafeValidatedBody(event, articleBodySchema)

    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось создать запись',
      })
    }

    const articleBody = body.data as ArticleBody

    const title = findTitle(articleBody) || `Запись пользователя ${user!.name}`
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

    if (!data) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось создать запись',
      })
    }

    return data
  },
  { requireAuth: true }
)
