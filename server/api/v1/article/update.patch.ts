import getSlug from '~/utils/getSlug'
import { z, useSafeValidatedBody } from 'h3-zod'
import DocSchema from '~/server/schema/articleDoc'
import findTitle from '~/server/utils/findTitle'

export default defineApiRoute(
  async ({ event, supabase, user }) => {
    const body = await useSafeValidatedBody(
      event,
      z.object({ id: z.number(), body: DocSchema })
    )

    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: 'Неправильная структура объекта поста',
      })
    }

    const { id, body: articleBody } = body.data

    const title = findTitle(articleBody) || `Запись пользователя ${user!.name}`
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

    if (!data) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось обновить пост',
      })
    }

    return data
  },
  { requireAuth: true }
)
