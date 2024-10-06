export default defineApiRoute(async ({ event, supabase }) => {
  const { email, token } = await readBody(event)

  if (!(email && token))
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })

  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })

  if (error)
    throw createError({
      statusCode: error.status,
      message: error.message,
    })

  const { access_token, refresh_token } = data.session!

  setCookie(event, 'sb-access-token', access_token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
    sameSite: 'lax',
  })

  setCookie(event, 'sb-refresh-token', refresh_token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
    sameSite: 'lax',
  })

  return data
})
