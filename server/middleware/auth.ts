import { serverSupabaseClient } from '#supabase/server'
import { Profile } from '~/types'
import { Database } from '~/types/supabase'

declare module 'h3' {
  interface H3EventContext {
    profile: Profile | null
  }
}

export default defineEventHandler(async (event) => {
  event.context.profile = null

  const supabase = await serverSupabaseClient<Database>(event)

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!user || userError) return

  const { data: profile, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!profile || error) return

  event.context.profile = profile
})
