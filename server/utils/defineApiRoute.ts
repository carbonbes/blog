import type { H3Event, EventHandler, EventHandlerRequest } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { Profile, Supabase } from '~/types'

type Handler = ({
  event,
  supabase,
  profile,
}: {
  event: H3Event
  supabase: Supabase
  profile: Profile | null
}) => any

export function defineApiRoute<T extends EventHandlerRequest, D>(
  handler: Handler,
  options?: { requireAuth?: boolean }
): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    const supabase: Supabase = await serverSupabaseClient(event)
    const profile = event.context.profile

    if (options?.requireAuth && !profile)
      throw createError({ statusCode: 401, message: 'Требуется авторизация' })

    try {
      const response = await handler({ event, supabase, profile })

      return { success: true, data: response }
    } catch (err: any) {
      setResponseStatus(event, err.statusCode)

      return { success: false, message: err.message }
    }
  })
}
