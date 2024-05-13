import isValidEmail from '~/utils/isValidEmail'

export default defineApiEndpoint(async ({ event, supabase }) => {
  const {
    email,
    name
  }: {
    email: string
    name: string
  } = await readBody(event)

  if (!(email && email))
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })

  if (!isValidEmail(email))
    throw createError({
      statusCode: 400,
      message: 'Невалидная почта',
    })

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        name
      }
    }
  })

  if (error)
    throw createError({
      statusCode: error.status,
      message: error.message,
    })

  return data
})