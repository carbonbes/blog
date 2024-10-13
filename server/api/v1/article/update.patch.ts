import getSlug from '~/utils/getSlug'
import { z, useSafeValidatedBody } from 'h3-zod'
import articleBodySchema from '~/server/schema/articleBodySchema'
import findTitle from '~/server/utils/findTitle'
import { ArticleBody } from '~/types'

export default defineApiRoute(
  async ({ event, supabase, user }) => {
    const body = await useSafeValidatedBody(
      event,
      z.object({ id: z.number(), body: articleBodySchema })
    )

    if (!body.success) {
      console.log(body.error)

      throw createError({
        statusCode: 400,
        message: 'Не удалось обновить запись',
      })
    }

    const {
      id,
      body: articleBody,
    }: {
      id: number
      body: ArticleBody
    } = body.data

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
        message: 'Не удалось обновить запись',
      })
    }

    return data
  },
  { requireAuth: true }
)
