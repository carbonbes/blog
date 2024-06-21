import getEmbedType from '~/utils/getEmbedType'
import { TwitterApiTweetResponse } from '~/types'

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

  if (type === 'twitter') {
    const tweetIdRegexp = /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+\/([0-9]{19})/gi
    const matches = tweetIdRegexp.exec(url)

    const { guest_token } = await $fetch<{ guest_token: string }>('https://api.twitter.com/1.1/guest/activate.json', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
      }
    })

    const r = await $fetch<TwitterApiTweetResponse>(`https://api.x.com/graphql/Xl5pC_lBk_gcO2ItU39DQw/TweetResultByRestId?variables=%7B%22tweetId%22%3A%22${matches![1]}%22%2C%22withCommunity%22%3Afalse%2C%22includePromotedContent%22%3Afalse%2C%22withVoice%22%3Afalse%7D&features=%7B%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`, {
      headers: {
        Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        'X-Guest-Token': guest_token
      }
    })

    return {
      author: {
        avatar: r.data.tweetResult.result.core.user_results.result.legacy.profile_image_url_https,
        name: r.data.tweetResult.result.core.user_results.result.legacy.name,
        tag: r.data.tweetResult.result.core.user_results.result.legacy.screen_name
      },
      text: r.data.tweetResult.result.legacy.full_text,
      media: r.data.tweetResult.result.legacy.entities.media?.map((media) => {
        if (media.type === 'photo') {
          return {
            url: media.media_url_https,
            type: media.type
          }
        } else return {
          url: media.video_info.variants[0].url,
          thumbnail: media.media_url_https,
          type: media.type
        }
      }),
      published: r.data.tweetResult.result.legacy.created_at
    }
  }
})
