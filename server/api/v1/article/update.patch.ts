import { ArticleContent } from '~/types'
import getSlug from '~/utils/getSlug'

export default defineApiRoute(
  async ({ event, supabase, profile }) => {
    const {
      id,
      body,
    }: {
      id: number
      body: ArticleContent | undefined
    } = await readBody(event)

    if (!(id && body)) {
      throw createError({
        statusCode: 400,
        message: 'Заполните все необходимые поля',
      })
    }

    const title =
      body.content?.find((node) => node.content![0].type?.startsWith('heading'))
        ?.content![0].text || `Запись пользователя ${profile!.name}`

    const titleSlug = getSlug(title)

    const { data, error } = await supabase
      .from('articles')
      .update({
        title,
        title_slug: titleSlug,
        body,
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
