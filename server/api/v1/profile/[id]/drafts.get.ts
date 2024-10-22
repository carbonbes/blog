import { useSafeValidatedParams, z } from 'h3-zod'

export default defineApiRoute(
  async ({ event, supabase, user }) => {
    const params = await useSafeValidatedParams(event, { id: z.number() })

    if (!params.success) {
      throw createError({
        statusCode: 400,
        message: 'Заполните все необходимые поля',
      })
    }

    const {
      data: { id: profileId },
    } = params

    if (profileId !== user.id) {
      throw createError({
        statusCode: 403,
        message: 'У вас нет прав на просмотр чужих черновиков',
      })
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*, author(id, name)')
      .match({ 'author.id': profileId, status: 'draft' })
      .order('created_at', { ascending: false })
      .range(0, 9)

    if (error)
      throw createError({
        statusCode: +error.code,
        message: error.message,
      })

    return data
  },
  { requireAuth: true }
)
