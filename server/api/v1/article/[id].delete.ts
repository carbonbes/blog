import { z, useSafeValidatedParams } from 'h3-zod'
import isOwner from '~/server/utils/isOwner'
import { Article } from '~/types'

export default defineApiRoute(
  async ({ event, supabase, user }) => {
    const params = await useSafeValidatedParams(event, {
      id: z.string().trim().min(1),
    })

    if (!params.success) {
      throw createError({
        statusCode: 400,
        message: 'Укажите идентификатор записи',
      })
    }

    const { id } = params.data

    const { data: article, error } = await supabase
      .from('articles')
      .select('author(id)')
      .eq('id', id)
      .single()

    if (error) {
      throw createError({
        statusCode: +error.code,
        message: error.message,
      })
    }

    if (!isOwner(user, article as unknown as Article)) {
      throw createError({
        statusCode: 403,
        message: 'У вас нет прав на удаление чужих записей',
      })
    }

    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw createError({
        statusCode: +deleteError.code,
        message: deleteError.message,
      })
    }
  },
  { requireAuth: true }
)
