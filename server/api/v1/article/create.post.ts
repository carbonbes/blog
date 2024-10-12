import getSlug from '~/utils/getSlug'
import { useSafeValidatedBody } from 'h3-zod'
import DocSchema from '~/server/schema/articleDoc'
import findTitle from '~/server/utils/findTitle'

export default defineApiRoute(
  async ({ event, supabase, user }) => {
    const body = await useSafeValidatedBody(event, DocSchema)

    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: 'Неправильная структура объекта поста',
      })
    }

    const articleBody = body.data

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
        message: 'Не удалось создать пост',
      })
    }

    return data
  },
  { requireAuth: true }
)
