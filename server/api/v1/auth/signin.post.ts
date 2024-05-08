import { serverSupabaseClient } from '#supabase/server'

export default defineApiEndpoint(async (event) => {
  const {
    email,
    name,
    avatar,
  }: {
    email: string
    name: string
    avatar?: string
  } = await readBody(event)

  if (!(email && name))
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })

  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        name,
        avatar,
      },
    },
  })

  if (error)
    throw createError({
      statusCode: error.status,
      message: error.message,
    })

  return data
})
