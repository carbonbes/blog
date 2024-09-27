import getEmbedType from '~/utils/getEmbedType'
import { TwitterApiTweetResponse } from '~/types'
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'
import { Api } from 'telegram/tl/index.js'
import getBase64FromBuffer from '~/utils/getBase64FromBuffer'

const {
  xApiGuestTokenUrl,
  xApiAuthToken,
  xApiUrl,
  telegramApiId,
  telegramApiHash,
  telegramApiStringSession,
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
      type: 'post_media'
    }

async function initTelegramClient() {
  const stringSession = new StringSession(telegramApiStringSession)
  const telegram = new TelegramClient(
    stringSession,
    +telegramApiId,
    telegramApiHash,
    {}
  )
  await telegram.connect()

  return telegram
}

async function getTelegramChannelName(
  telegram: TelegramClient,
  channelUsername: string
) {
  const {
    chats: [{ title: channelName }],
  } = await telegram.invoke(
    new Api.channels.GetChannels({
      id: [channelUsername],
    })
  )

  return channelName
}

async function uploadTelegramMedia(args: TelegramMediaArgs) {
  const { telegram } = args

  const buffer =
    args.type === 'post_media'
      ? await telegram.downloadMedia(args.media)
      : await telegram.downloadProfilePhoto(args.channelUsername)

  if (!buffer) return

  const base64 = await getBase64FromBuffer(buffer as Buffer)

  const {
    secure_url: url,
    public_id,
    format,
    width,
    height,
    resource_type,
  } = await upload(base64)

  return {
    url,
    ...(resource_type === 'video' && {
      thumbnail: `https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/${public_id}.${format}`,
    }),
    width,
    height,
    type: resource_type as 'image' | 'video',
  }
}

async function getTelegramPostData(
  telegram: TelegramClient,
  channelUsername: string,
  postId: number
) {
  const [post] = await telegram.getMessages(channelUsername, {
    ids: new Api.InputMessageID({ id: postId }),
  })

  let media:
    | {
        url: string
        alt?: string
        thumbnail?: string
        width: number
        height: number
        type: 'image' | 'video'
      }[]
    | undefined = undefined

  if (post.media && !post.groupedId) {
    const mediaItem = await uploadTelegramMedia({
      telegram,
      media: post.media,
      type: 'post_media',
    })

    if (!mediaItem) return

    media = [mediaItem]
  } else if (post.media && post.groupedId) {
    const ids: number[] = []

    for (let i = +postId + 1; i <= +postId + 10; i++) {
      ids.push(i)
    }

    const posts = (
      await telegram.getMessages(channelUsername, {
        ids,
      })
    ).filter((p) => Number(p?.groupedId) === Number(post.groupedId))

    const mediaForUpload = [post.media, ...posts.map((post) => post.media)]

    media = (
      await Promise.all(
        mediaForUpload.map(async (media) => {
          if (!media) return

          const mediaItem = await uploadTelegramMedia({
            telegram,
            media,
            type: 'post_media',
          })

          if (!mediaItem) return

          return mediaItem
        })
      )
    ).filter((media) => !!media)
  }

  return {
    text: post.text,
    media,
    published: post.date * 1000,
  }
}

async function uploadXMedia(media: string) {
  const {
    secure_url: url,
    public_id,
    format,
    width,
    height,
    resource_type,
  } = await upload(media)

  return {
    url,
    ...(resource_type === 'video' && {
      thumbnail: `https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/${public_id}.${format}`,
    }),
    width,
    height,
    type: resource_type as 'image' | 'video',
  }
}

async function getXPostData(postId: string) {
  const { guest_token } = await $fetch<{ guest_token: string }>(
    xApiGuestTokenUrl,
    {
      method: 'POST',
      headers: {
        Authorization: xApiAuthToken,
      },
    }
  )

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

  let media:
    | {
        url: string
        alt?: string
        thumbnail?: string
        width: number
        height: number
        type: 'image' | 'video'
      }[]
    | undefined = undefined

  if (tweet.entities.media) {
    media = (
      await Promise.all(
        tweet.entities.media.map(async (tweetMedia) => {
          if (tweetMedia.type === 'photo') {
            return uploadXMedia(tweetMedia.media_url_https)
          }

          if (['video', 'animated_gif'].includes(tweetMedia.type)) {
            const videoUrl =
              tweetMedia.video_info!.variants[
                tweetMedia.video_info!.variants.length - 1
              ].url

            return uploadXMedia(videoUrl)
          }
        })
      )
    ).filter((media) => !!media)
  }

  return {
    author: {
      avatar,
      name: user.name,
      username: user.screen_name,
      url: `https://x.com/${user.screen_name}`,
    },
    text: tweet.full_text.replace(/https:\/\/t\.co\/\S+\s*$/gm, '').trim(),
    media,
    published: tweet.created_at,
  }
}

export default defineApiEndpoint(
  async ({ event }) => {
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
      try {
        const telegramPostRegexp =
          /https?:\/\/(?:telegram|t)\.me\/(.+)\/(\d+)/gi
        const [, channelUsername, postId] = telegramPostRegexp.exec(url) || []

        const telegram = await initTelegramClient()

        const channelName = await getTelegramChannelName(
          telegram,
          channelUsername
        )
        const post = await getTelegramPostData(
          telegram,
          channelUsername,
          +postId
        )
        const authorAvatar = await uploadTelegramMedia({
          telegram,
          channelUsername,
          type: 'profile_photo',
        })

        if (!post)
          throw createError({
            statusCode: 404,
            message: 'Пост не найден',
          })

        return {
          author: {
            avatar: authorAvatar?.url || null,
            name: channelName,
            username: channelUsername,
            url: `https://t.me/${channelUsername}`,
          },
          text: post.text,
          media: post.media,
          published: post.published,
          type,
          url,
        }
      } catch (error) {
        throw createError({
          statusCode: 400,
          message: 'Ошибка получения поста',
        })
      }
    }

    if (type === 'x') {
      try {
        const tweetIdRegexp =
          /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+\/([0-9]{19})/gi
        const [, postId] = tweetIdRegexp.exec(url) || []

        const post = await getXPostData(postId)

        return {
          author: post.author,
          text: post.text,
          media: post.media,
          published: post.published,
          type,
          url,
        }
      } catch (error: any) {
        console.log(error)

        throw createError({
          statusCode: 400,
          message: 'Ошибка получения поста',
        })
      }
    }
  },
  { requireAuth: true }
)
