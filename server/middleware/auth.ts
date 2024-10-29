import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { Profile } from '~/types'
import { Database } from '~/types/supabase'

declare module 'h3' {
  interface H3EventContext {
    user: Profile | null
  }
}

export default defineEventHandler(async (event) => {
  if (event.context.user) return

  event.context.user = null

  const supabase = await serverSupabaseClient<Database>(event)

  try {
    const user = await serverSupabaseUser(event)

    if (!user) return

    const { data: profile, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', user.id)
      .single()

    if (!profile || error) return

    event.context.user = user
  } catch (error) {}
})
