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
    .select()
    .eq('id', id)
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
      message: 'Не удалось получить пост',
    })
  }

  return data
})
