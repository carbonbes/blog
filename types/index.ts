import type { Database } from '~/types/supabase'
import {
  type AuthOtpResponse,
  type SupabaseClient,
} from '@supabase/supabase-js'
import type { FunctionalComponent, SVGAttributes } from 'vue'
import type { z } from 'zod'
import type ArticleBodySchema from '~/server/schema/articleBodySchema'
import type {
  GalleryNode,
  HeadingNode,
  HorizontalRuleNode,
  ListNode,
  ParagraphNode,
  SNEmbedNode,
  StorageMediaSchema,
  YoutubeEmbedNode,
} from '~/server/schema/articleBodySchema'

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

export type HeadingNode = z.infer<typeof HeadingNode>
export type ParagraphNode = z.infer<typeof ParagraphNode>
export type ListNode = z.infer<typeof ListNode>
export type GalleryNode = z.infer<typeof GalleryNode>
export type HorizontalRuleNode = z.infer<typeof HorizontalRuleNode>
export type YoutubeEmbedNode = z.infer<typeof YoutubeEmbedNode>
export type SNEmbedNode = z.infer<typeof SNEmbedNode>

export type StorageMedia = z.infer<typeof StorageMediaSchema>
export type ArticleBody = z.infer<typeof ArticleBodySchema>

export type Article = Omit<
  Database['public']['Tables']['articles']['Row'],
  'body'
> & { author: Profile; body: ArticleBody }

export type NodeType =
  | 'heading'
  | 'paragraph'
  | 'bulletList'
  | 'orderedList'
  | 'gallery'
  | 'SNEmbed'
  | 'link'
  | 'separator'

export type HeadingLevel = 1 | 2

export type NodeAttrs = Record<string, any>

export type SVGIcon = FunctionalComponent<SVGAttributes, {}, any, {}>

export type DropdownItem = {
  icon?: SVGIcon
  label?: string
  action?: () => void
  active?: boolean
  disabled?: boolean
  hide?: boolean
  subitems?: DropdownItem[]
  group?: DropdownItem[]
  class?: string | object
}

export type EmbedType = 'youtube' | 'x' | 'telegram'

export type SNEmbed = SNEmbedNode['attrs']['embed']

export type ImageTransformOptions = {
  width?: number
  height?: number
  resize?: 'cover' | 'contain' | 'fill'
  quality?: number
  format?: 'origin'
}
