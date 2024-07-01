import getEmbedType from '~/utils/getEmbedType'
import { TwitterApiTweetResponse } from '~/types'
import { uploadMediaByUrl } from '~/utils/api'

const { xGuestTokenUrl, xAuthToken, xApiUrl } = useRuntimeConfig()

export default defineApiEndpoint(async ({ event }) => {
  const { url }: { url: string } = getQuery(event)

  if (!url)
    throw createError({
      statusCode: 400,
      message: 'Заполните все обязательные поля',
    })

  const type = getEmbedType(url)

  if (!type)
    throw createError({
      statusCode: 400,
      message: 'Тип эмбеда не распознан',
    })

  if (type === 'telegram') {
    const postRegexp = /(?:https?:\/\/)?(?:www[.])?(?:telegram|t)\.me\/(.+)\/?\/(\d+)?$/gi
    const matches = postRegexp.exec(url)
  }

  if (type === 'x') {
    const tweetIdRegexp = /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+\/([0-9]{19})/gi
    const matches = tweetIdRegexp.exec(url)
    const xId = matches![1]

    const { guest_token } = await $fetch<{ guest_token: string }>(xGuestTokenUrl, {
      method: 'POST',
      headers: {
        Authorization: xAuthToken
      }
    })

    const {
      data: {
        tweetResult: {
          result: {
            core: {
              user_results: {
                result: { legacy: user },
              },
            },
            legacy: tweet,
          },
        },
      },
    } = await $fetch<TwitterApiTweetResponse>(
      `${xApiUrl}/TweetResultByRestId?variables=%7B%22tweetId%22%3A%22${xId}%22%2C%22withCommunity%22%3Afalse%2C%22includePromotedContent%22%3Afalse%2C%22withVoice%22%3Afalse%7D&features=%7B%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`,
      {
        headers: {
          Authorization: xAuthToken,
          'X-Guest-Token': guest_token,
        },
      }
    )

    return {
      author: {
        avatar: user.profile_image_url_https,
        name: user.name,
        username: user.screen_name,
      },
      text: tweet.full_text,
      media: tweet.entities.media?.map(async (media) => {
        if (media.type === 'photo') {
          const { data } = await uploadMediaByUrl(media.media_url_https)

          return {
            url: data?.url,
            width: data?.width,
            height: data?.height,
            type: 'image'
          }
        }
        
        if (['video', 'animated_gif'].includes(media.type)) {
          const variants = media.video_info.variants

          const { data } = await uploadMediaByUrl(variants[variants.length - 1].url)

          return {
            url: data?.url,
            thumbnail: media.type === 'video' ? `https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/${data?.public_id}.${data?.format}` : undefined,
            width: data?.width,
            height: data?.height,
            type: media.type === 'video' ? 'video' : media.type === 'animated_gif' ? 'gif' : undefined
          }
        }
      }),
      published: tweet.created_at,
      type
    }
  }
})
