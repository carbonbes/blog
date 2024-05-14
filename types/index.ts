import type { Database } from '~/types/supabase'
import { type AuthOtpResponse } from '@supabase/supabase-js'

export interface Response<T = {}> {
  success: boolean
  data?: T
  message?: string
}

export type OtpResponse = AuthOtpResponse

export type Profile = Database['public']['Tables']['profiles']['Row']
