import type { H3Event, EventHandler, EventHandlerRequest } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { Profile, Supabase } from '~/types'

type Handler = ({
  event,
  supabase,
  user,
}: {
  event: H3Event
  supabase: Supabase
  user: Profile | null
}) => any

export function defineApiRoute<T extends EventHandlerRequest, D>(
  handler: Handler,
  options?: { requireAuth?: boolean }
): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    const supabase: Supabase = await serverSupabaseClient(event)
    const user = event.context.user

    if (options?.requireAuth && !user) {
      throw createError({ statusCode: 401, message: 'Требуется авторизация' })
    }

    try {
      const response = await handler({ event, supabase, user })

      return { success: true, data: response }
    } catch (err: any) {
      setResponseStatus(event, err.statusCode)

      return { success: false, message: err.message }
    }
  })
}
