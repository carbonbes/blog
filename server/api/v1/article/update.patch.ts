import getSlug from '~/utils/getSlug'
import { z, useSafeValidatedBody } from 'h3-zod'
import articleBodySchema from '~/schema/articleBodySchema'
import findTitle from '~/server/utils/findTitle'

export default defineApiRoute(
  async ({ event, supabase, user: { name: userName } }) => {
    const body = await useSafeValidatedBody(
      event,
      z.object({ id: z.number(), body: articleBodySchema })
    )

    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось обновить запись',
      })
    }

    const { id, body: articleBody } = body.data

    const title = findTitle(articleBody) || `Запись пользователя ${userName}`
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
