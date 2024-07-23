import getEmbedType from '~/utils/getEmbedType'
import { CDNMedia, TwitterApiTweetResponse } from '~/types'
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { Api } from 'telegram/tl'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'

const {
  xApiGuestTokenUrl,
  xApiAuthToken,
  xApiUrl,
  telegramApiId,
  telegramApiHash,
  telegramApiStringSession
} = useRuntimeConfig()

const { upload } = useCdn()

type TelegramMediaArgs = 
  | {
      telegram: TelegramClient
      channelUsername: string
      type: 'profile_photo'
    }
  | {
      telegram: TelegramClient
      media: Api.TypeMessageMedia
      type: 'media'
    }

async function getTelegramMedia(args: TelegramMediaArgs) {
  const { telegram } = args

  const buffer = args.type === 'media'
    ? await telegram.downloadMedia(args.media) as Buffer
    : await telegram.downloadProfilePhoto(args.channelUsername) as Buffer

  const mimeType = await getMimeTypeFromBuffer(buffer)

  const base64 = `data:${mimeType};base64,` + Buffer.from(buffer).toString('base64')

  return await upload(base64)
}

function getEmbedMedia(media: CDNMedia) {
  const {
    secure_url,
    public_id,
    format,
    width,
    height,
    resource_type
  } = media

  return {
    url: secure_url,
    ...(resource_type === 'video' && { thumbnail: `https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/${public_id}.${format}` }),
    width,
    height,
    type: resource_type
  }
}

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
    const telegramPostRegexp = /https?:\/\/(?:telegram|t)\.me\/(.+)\/(\d+)/gi
    const [, channelUsername, postId] = telegramPostRegexp.exec(url) || []

    const stringSession = new StringSession(telegramApiStringSession)
    const telegram = new TelegramClient(stringSession, +telegramApiId, telegramApiHash, {})
    await telegram.connect()

    const { chats: [{ title: channelName }] } = await telegram.invoke(
      new Api.channels.GetChannels({
        id: [channelUsername]
      })
    )

    const [mainPost] = await telegram.getMessages(
      channelUsername,
      {
        ids: new Api.InputMessageID({ id: postId as unknown as number }),
      }
    )

    const avatar = (await getTelegramMedia({ telegram, channelUsername, type: 'profile_photo' })).secure_url

    if (mainPost.media && mainPost.groupedId) {
      const ids: number[] = []

      for (let i = +postId + 1; i <= +postId + 10; i++) {
        ids.push(i)
      }

      const groupedPosts = (
        await telegram.getMessages(channelUsername, {
          ids,
        })
      ).filter((post) => Number(post?.groupedId) === Number(mainPost.groupedId))

      groupedPosts.unshift(mainPost)

      const media = await Promise.all(
        groupedPosts.map(async (post) => {
          if (!post.media) return

          const media = await getTelegramMedia({ telegram, media: post.media, type: 'media' })

          return getEmbedMedia(media)
        })
      )

      return {
        author: {
          avatar: avatar,
          name: channelName,
          username: channelUsername,
          url: `https://t.me/${channelUsername}`
        },
        text: mainPost.message,
        media,
        published: mainPost.date * 1000,
        type,
        url
      }
    } else if (mainPost.media && !mainPost.groupedId) {
      const media = await getTelegramMedia({ telegram, media: mainPost.media, type: 'media' })

      return {
        author: {
          avatar,
          name: channelName,
          username: channelUsername,
          url: `https://t.me/${channelUsername}`
        },
        text: mainPost.message,
        media: [getEmbedMedia(media)],
        published: mainPost.date * 1000,
        type,
        url
      }
    }
  }

  if (type === 'x') {
    const tweetIdRegexp = /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+\/([0-9]{19})/gi
    const [, postId] = tweetIdRegexp.exec(url) || []

    const { guest_token } = await $fetch<{ guest_token: string }>(xApiGuestTokenUrl, {
      method: 'POST',
      headers: {
        Authorization: xApiAuthToken
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
      `${xApiUrl}/TweetResultByRestId?variables=%7B%22tweetId%22%3A%22${postId}%22%2C%22withCommunity%22%3Afalse%2C%22includePromotedContent%22%3Afalse%2C%22withVoice%22%3Afalse%7D&features=%7B%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`,
      {
        headers: {
          Authorization: xApiAuthToken,
          'X-Guest-Token': guest_token,
        },
      }
    )

    const avatar = (await upload(user.profile_image_url_https)).secure_url

    const media = await Promise.all(
      tweet.entities.media?.map(async (tweetMedia) => {
        if (tweetMedia.type === 'photo') {
          const media = await upload(tweetMedia.media_url_https)

          return getEmbedMedia(media)
        }

        if (['video', 'animated_gif'].includes(tweetMedia.type)) {
          const video = tweetMedia.video_info!.variants[tweetMedia.video_info!.variants.length - 1].url

          const media = await upload(video)

          return getEmbedMedia(media)
        }
      })
    )

    return {
      author: {
        avatar,
        name: user.name,
        username: user.screen_name,
        url: `https://x.com/${user.screen_name}`
      },
      text: tweet.full_text.replace(/https:\/\/t\.co\/\S+\s*$/gm, '').trim(),
      media,
      published: tweet.created_at,
      type,
      url
    }
  }
})
