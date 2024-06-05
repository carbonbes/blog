import type { Database } from '~/types/supabase'
import {
  type AuthOtpResponse,
  type SupabaseClient,
} from '@supabase/supabase-js'
import type { UploadApiResponse } from 'cloudinary'
import type { FunctionalComponent, SVGAttributes } from 'vue'
import type { JSONContent } from '@tiptap/vue-3'

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

export type Article = Database['public']['Tables']['articles']['Row']

export type NodeType =
  | 'heading'
  | 'paragraph'
  | 'bulletList'
  | 'orderedList'
  | 'gallery'
  | 'socialNetworkEmbed'
  | 'link'
  | 'delimiter'

export type HeadingLevel = 1 | 2

export type CDNMedia = UploadApiResponse

export type SVGIcon = FunctionalComponent<SVGAttributes, {}, any, {}>

export type ArticleContent = JSONContent

export type DropdownItem = {
  icon?: SVGIcon
  label?: string
  action?: () => void
  active?: boolean
  disabled?: boolean
  hide?: boolean
  separator?: boolean
  subitems?: DropdownItem[]
}
