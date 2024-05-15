import type { Database } from '~/types/supabase'
import {
  type AuthOtpResponse,
  type SupabaseClient,
} from '@supabase/supabase-js'

export interface Response<T = {}> {
  success: boolean
  data?: T
  message?: string
}

export type Supabase = SupabaseClient<Database>

export interface Notification {
  id?: string
  title?: string
  text: string
  duration?: number
  type?: 'success' | 'error'
}

export type VerifyOtpResponse = AuthOtpResponse

export type Profile = Database['public']['Tables']['profiles']['Row']
