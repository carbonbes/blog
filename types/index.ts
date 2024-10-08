import type { Database } from '~/types/supabase'
import {
  type AuthOtpResponse,
  type SupabaseClient,
} from '@supabase/supabase-js'
import type { FunctionalComponent, SVGAttributes } from 'vue'
import type { JSONContent } from '@tiptap/vue-3'
import type { MimeType } from 'file-type'
import type { Color, FitEnum, KernelEnum, Sharp } from 'sharp'

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
  | 'SNEmbed'
  | 'link'
  | 'separator'

export type HeadingLevel = 1 | 2

export type NodeAttrs = Record<string, any>

export type StorageMedia = {
  name: string
  url: string
  width: number
  height: number
  duration?: number
  mime_type: MimeType
  description?: string
  thumbnail?: {
    name: string
    url: string
    width: number
    height: number
    mime_type: MimeType
  }
}

export type SVGIcon = FunctionalComponent<SVGAttributes, {}, any, {}>

export type ArticleContent = JSONContent

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

export type TwitterApiTweetResponse = {
  data: {
    tweetResult: {
      result: {
        __typename: 'TweetUnavailable' | string
        rest_id: string
        core: {
          user_results: {
            result: {
              __typename: string
              id: string
              rest_id: string
              affiliates_highlighted_label: {}
              is_blue_verified: boolean
              profile_image_shape: string
              legacy: {
                created_at: string
                default_profile: boolean
                default_profile_image: boolean
                description: string
                entities: {
                  description: {
                    urls: Array<any>
                  }
                }
                fast_followers_count: number
                favourites_count: number
                followers_count: number
                friends_count: number
                has_custom_timelines: boolean
                is_translator: boolean
                listed_count: number
                location: string
                media_count: number
                name: string
                normal_followers_count: number
                pinned_tweet_ids_str: Array<string>
                possibly_sensitive: boolean
                profile_banner_url: string
                profile_image_url_https: string
                profile_interstitial_type: string
                screen_name: string
                statuses_count: number
                translator_type: string
                verified: boolean
                withheld_in_countries: Array<any>
              }
              tipjar_settings: {
                is_enabled: boolean
                bandcamp_handle: string
                bitcoin_handle: string
                cash_app_handle: string
                ethereum_handle: string
                gofundme_handle: string
                patreon_handle: string
                pay_pal_handle: string
                venmo_handle: string
              }
            }
          }
        }
        unmention_data: {}
        edit_control: {
          edit_tweet_ids: Array<string>
          editable_until_msecs: string
          is_edit_eligible: boolean
          edits_remaining: string
        }
        is_translatable: boolean
        views: {
          count: string
          state: string
        }
        source: string
        legacy: {
          bookmark_count: number
          bookmarked: boolean
          created_at: string
          conversation_id_str: string
          display_text_range: Array<number>
          entities: {
            hashtags: Array<any>
            media: Array<{
              display_url: string
              expanded_url: string
              id_str: string
              indices: Array<number>
              media_key: string
              media_url_https: string
              type: 'photo' | 'video'
              url: string
              ext_media_availability: {
                status: string
              }
              features: {
                large: {
                  faces: Array<{
                    x: number
                    y: number
                    h: number
                    w: number
                  }>
                }
                medium: {
                  faces: Array<{
                    x: number
                    y: number
                    h: number
                    w: number
                  }>
                }
                small: {
                  faces: Array<{
                    x: number
                    y: number
                    h: number
                    w: number
                  }>
                }
                orig: {
                  faces: Array<{
                    x: number
                    y: number
                    h: number
                    w: number
                  }>
                }
              }
              sizes: {
                large: {
                  h: number
                  w: number
                  resize: string
                }
                medium: {
                  h: number
                  w: number
                  resize: string
                }
                small: {
                  h: number
                  w: number
                  resize: string
                }
                thumb: {
                  h: number
                  w: number
                  resize: string
                }
              }
              original_info: {
                height: number
                width: number
                focus_rects: Array<{
                  x: number
                  y: number
                  w: number
                  h: number
                }>
              }
              allow_download_status: {
                allow_download: boolean
              }
              video_info?: {
                aspect_ratio: [1, 1]
                duration_millis: 39886
                variants: {
                  content_type: 'application/x-mpegURL' | 'video/mp4'
                  url: string
                  bitrate?: number
                }[]
              }
              media_results: {
                result: {
                  media_key: string
                }
              }
            }>
            symbols: Array<any>
            timestamps: Array<any>
            urls: Array<any>
            user_mentions: Array<any>
          }
          extended_entities: {
            media: Array<{
              display_url: string
              expanded_url: string
              id_str: string
              indices: Array<number>
              media_key: string
              media_url_https: string
              type: string
              url: string
              ext_media_availability: {
                status: string
              }
              features: {
                large: {
                  faces: Array<{
                    x: number
                    y: number
                    h: number
                    w: number
                  }>
                }
                medium: {
                  faces: Array<{
                    x: number
                    y: number
                    h: number
                    w: number
                  }>
                }
                small: {
                  faces: Array<{
                    x: number
                    y: number
                    h: number
                    w: number
                  }>
                }
                orig: {
                  faces: Array<{
                    x: number
                    y: number
                    h: number
                    w: number
                  }>
                }
              }
              sizes: {
                large: {
                  h: number
                  w: number
                  resize: string
                }
                medium: {
                  h: number
                  w: number
                  resize: string
                }
                small: {
                  h: number
                  w: number
                  resize: string
                }
                thumb: {
                  h: number
                  w: number
                  resize: string
                }
              }
              original_info: {
                height: number
                width: number
                focus_rects: Array<{
                  x: number
                  y: number
                  w: number
                  h: number
                }>
              }
              allow_download_status: {
                allow_download: boolean
              }
              media_results: {
                result: {
                  media_key: string
                }
              }
            }>
          }
          favorite_count: number
          favorited: boolean
          full_text: string
          is_quote_status: boolean
          lang: string
          possibly_sensitive: boolean
          possibly_sensitive_editable: boolean
          quote_count: number
          reply_count: number
          retweet_count: number
          retweeted: boolean
          user_id_str: string
          id_str: string
        }
        reason: 'NsfwLoggedOut' | string
      }
    }
  }
}

export type SNEmbed = {
  author: {
    avatar: StorageMedia
    name: string
    username: string
    url: string
  }
  text?: string
  media?: StorageMedia[]
  published: string
  type: Exclude<EmbedType, 'youtube'>
  url: string
}

export type ImageTransformOptions = {
  width?: number
  height?: number
  resize?: 'cover' | 'contain' | 'fill'
  quality?: number
  format?: 'origin'
}
