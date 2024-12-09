import type { H3Event, EventHandler, EventHandlerRequest } from 'h3'
import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from '#supabase/server'
import { Profile, Supabase } from '~/types'

type Handler<RequireAuth extends boolean> = ({
  event,
  supabase,
  adminSupabase,
  user,
}: {
  event: H3Event
  supabase: Supabase
  adminSupabase: Supabase
  user: RequireAuth extends true ? Profile : Profile | null
}) => any

export function defineApiRoute<
  T extends EventHandlerRequest,
  D,
  RequireAuth extends boolean
>(
  handler: Handler<RequireAuth>,
  options?: { requireAuth?: RequireAuth }
): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    const supabase: Supabase = await serverSupabaseClient(event)
    const adminSupabase: Supabase = serverSupabaseServiceRole(event)
    const user = event.context.user

    if (options?.requireAuth && !user) {
      throw createError({ statusCode: 401, message: 'Требуется авторизация' })
    }

    try {
      const response = await handler({
        event,
        supabase,
        adminSupabase,
        user: (options?.requireAuth
          ? (user as Profile)
          : user) as RequireAuth extends true ? Profile : Profile | null,
      })

      return { success: true, data: response }
    } catch (err: any) {
      setResponseStatus(event, err.statusCode)

      return { success: false, message: err.message }
    }
  })
}
