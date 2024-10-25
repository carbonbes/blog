import { useSafeValidatedParams, useSafeValidatedQuery, z } from 'h3-zod'

export default defineApiRoute(async ({ event, supabase }) => {
  const params = await useSafeValidatedParams(event, {
    id: z.string(),
  })

  const query = await useSafeValidatedQuery(event, {
    page: z.string().default('1').optional(),
  })

  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Укажите ID профиля',
    })
  }

  if (!query.success) {
    throw createError({
      statusCode: 400,
      message: 'Укажите страницу',
    })
  }

  const profileId = params.data.id
  const page = +query.data.page!

  const pageSize = 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('articles')
    .select('*, author(id, name)')
    .eq('author.id', profileId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw createError({
      statusCode: +error.code,
      message: error.message,
    })
  }

  return data
})
