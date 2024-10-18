export default defineApiRoute(async ({ event, supabase }) => {
  const profileId = getRouterParam(event, 'id')

  if (!profileId)
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })

  const { data, error } = await supabase
    .from('articles')
    .select('*, author(id, name)')
    .eq('author', profileId)
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
