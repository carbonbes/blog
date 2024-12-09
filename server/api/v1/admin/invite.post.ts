import isValidEmail from '~/utils/isValidEmail'
import { z, useSafeValidatedBody } from 'h3-zod'

export default defineApiRoute(
  async ({ event, adminSupabase, user }) => {
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

    const { error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
      data: {
        name,
      },
    })

    if (error) {
      throw createError({
        statusCode: error.status,
        message: error.message,
      })
    }
  },
  { requireAuth: true }
)
