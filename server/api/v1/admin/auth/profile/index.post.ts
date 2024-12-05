import isValidEmail from '~/utils/isValidEmail'
import { z, useSafeValidatedBody } from 'h3-zod'

export default defineApiRoute(
  async ({ event, supabase, user }) => {
    if (user.role !== 'admin') {
      throw createError({ statusCode: 403, message: 'Доступ запрещен' })
    }

    const body = await useSafeValidatedBody(
      event,
      z.object({
        email: z.string().trim().min(1),
        name: z.string().trim().min(1),
      })
    )

    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: 'Заполните все необходимые поля',
      })
    }

    const { email, name } = body.data

    if (!isValidEmail(email)) {
      throw createError({
        statusCode: 400,
        message: 'Невалидная почта',
      })
    }

    const { data: existingProfile, error: existingProfileError } =
      await supabase.from('profiles').select().eq('email', email).single()

    // if (existingProfileError) {
    //   throw createError({
    //     statusCode: +existingProfileError.code,
    //     message: existingProfileError.message,
    //   })
    // }

    if (existingProfile) {
      throw createError({
        statusCode: 400,
        message: 'Профиль с такой почтой уже существует',
      })
    }

    const { error: signupError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          name,
        },
      },
    })

    if (signupError) {
      throw createError({
        statusCode: signupError.status,
        message: signupError.message,
      })
    }
  },
  { requireAuth: true }
)
