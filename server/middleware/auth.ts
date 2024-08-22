import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Profile } from '~/types'
import { Database } from '~/types/supabase'

declare module 'h3' {
  interface H3EventContext {
    profile: Profile | null
  }
}

export default defineEventHandler(async (event) => {
  if (event.context.profile) return
  
  event.context.profile = null

  const supabase = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  if (!user) return

  const { data: profile, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!profile || error) return

  event.context.profile = profile
})
