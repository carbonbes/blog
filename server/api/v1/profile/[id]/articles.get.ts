import { useSafeValidatedParams, z } from 'h3-zod'

export default defineApiRoute(async ({ event, supabase }) => {
  const params = await useSafeValidatedParams(event, { id: z.string() })

  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })
  }

  const {
    data: { id: profileId },
  } = params

  const { data, error } = await supabase
    .from('articles')
    .select('*, author(id, name)')
    .eq('author.id', profileId)
    .order('created_at', { ascending: false })
    .range(0, 9)

  if (error)
    throw createError({
      statusCode: +error.code,
      message: error.message,
    })

  if (!data)
    throw createError({
      statusCode: 404,
      message: 'Ничего не найдено',
    })

  return data
})
