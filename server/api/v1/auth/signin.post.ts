import isValidEmail from '~/utils/isValidEmail'

export default defineApiRoute(async ({ event, supabase }) => {
  const {
    email,
  }: {
    email: string
  } = await readBody(event)

  if (!email)
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
      shouldCreateUser: false,
    },
  })

  if (error)
    throw createError({
      statusCode: error.status,
      message: error.message,
    })

  return data
})
