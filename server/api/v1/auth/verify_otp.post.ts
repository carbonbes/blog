import isValidEmail from '~/utils/isValidEmail'
import { z, useSafeValidatedBody } from 'h3-zod'

export default defineApiRoute(async ({ event, supabase }) => {
  const body = await useSafeValidatedBody(
    event,
    z.object({
      email: z.string().trim().min(1),
      token: z.string().trim().min(6),
    })
  )

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Заполните все необходимые поля',
    })
  }

  const { email, token } = body.data

  if (!isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      message: 'Невалидная почта',
    })
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: token,
    type: 'email',
  })

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
