export default defineApiRoute(async ({ event, supabase }) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*, author(id, name)')
    .eq('id', id)
    .single()

  if (error) {
    throw createError({
      statusCode: +error.code,
      message: error.message,
    })
  }

  return data
})
