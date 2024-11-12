import { z, useSafeValidatedParams } from 'h3-zod'

export default defineApiRoute(async ({ event, supabase }) => {
  const params = await useSafeValidatedParams(event, {
    id: z.string().trim().min(1),
  })

  if (!params.success) {
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })
  }

  const id = params.data.id

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
