import { ArticleContent } from '~/types'
import getSlug from '~/utils/getSlug'

export default defineApiRoute(
  async ({ event, supabase, profile }) => {
    const body: ArticleContent | undefined = await readBody(event)

    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'Заполните все необходимые поля',
      })
    }

    const title = body.content?.find((node) =>
      node.content![0].type?.startsWith('heading')
    )?.content![0].text

    const titleSlug = getSlug(title || `Запись пользователя ${profile!.name}`)

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        title_slug: titleSlug,
        body,
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
