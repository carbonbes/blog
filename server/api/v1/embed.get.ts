import getEmbedType from '~/utils/getEmbedType'
import { StorageMedia, Supabase, TwitterApiTweetResponse } from '~/types'
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'
import { Api } from 'telegram/tl/index.js'
import getFileFromBuffer from '~/utils/getFileFromBuffer'
import uploadFileToStorage from '~/server/utils/uploadFileToStorage'
import { MimeType } from 'file-type'

const {
  xApiGuestTokenUrl,
  xApiAuthToken,
  xApiUrl,
  telegramApiId,
  telegramApiHash,
  telegramApiStringSession,
} = useRuntimeConfig()

type TelegramMediaArgs =
  | {
      supabase: Supabase
      telegram: TelegramClient
      channelUsername: string
      type: 'profile_photo'
    }
  | {
      supabase: Supabase
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

  return channelName as string
}

async function uploadTelegramMedia(args: TelegramMediaArgs) {
  const { supabase, telegram } = args

  const buffer =
    args.type === 'post_media'
      ? ((await telegram.downloadMedia(args.media)) as Buffer)
      : ((await telegram.downloadProfilePhoto(args.channelUsername)) as Buffer)

  if (!buffer) return

  const file = await getFileFromBuffer(buffer)

  if (!file) return

  const media = await uploadFileToStorage({ supabase, file: buffer })

  const { name, url, width, height, thumbnail, duration, mime_type } = media

  return {
    name,
    url,
    width,
    height,
    thumbnail: thumbnail
      ? {
          name: thumbnail.name,
          url: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height,
          mime_type: thumbnail.mime_type,
        }
      : undefined,
    duration: duration ?? undefined,
    mime_type: mime_type as MimeType,
  }
}

async function getTelegramPostData(
  supabase: Supabase,
  telegram: TelegramClient,
  channelUsername: string,
  postId: number
) {
  const [post] = await telegram.getMessages(channelUsername, {
    ids: new Api.InputMessageID({ id: postId }),
  })

  let media: StorageMedia[] | undefined = undefined

  if (post.media && !post.groupedId) {
    const mediaItem = await uploadTelegramMedia({
      supabase,
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
            supabase,
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

async function uploadXMedia(supabase: Supabase, mediaUrl: string) {
  const blob = await $fetch<any>(mediaUrl)

  if (!blob || !(blob instanceof Blob))
    throw createError({
      statusCode: 400,
      message: 'Не удалось скачать медиафайл',
    })

  const buffer = Buffer.from(await blob.arrayBuffer())

  const media = await uploadFileToStorage({ supabase, file: buffer })

  const { name, url, width, height, thumbnail, duration, mime_type } = media

  return {
    name,
    url,
    width,
    height,
    thumbnail: thumbnail
      ? {
          name: thumbnail.name,
          url: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height,
          mime_type: thumbnail.mime_type,
        }
      : undefined,
    duration: duration ?? undefined,
    mime_type: mime_type as MimeType,
  }
}

async function getXPostData(supabase: Supabase, postId: string) {
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

  const avatar = await uploadXMedia(supabase, user.profile_image_url_https)

  let media: StorageMedia[] | undefined = undefined

  if (tweet.entities.media) {
    media = (
      await Promise.all(
        tweet.entities.media.map(async (tweetMedia) => {
          if (tweetMedia.type === 'photo') {
            return uploadXMedia(supabase, tweetMedia.media_url_https)
          }

          if (['video', 'animated_gif'].includes(tweetMedia.type)) {
            const videoUrl =
              tweetMedia.video_info!.variants[
                tweetMedia.video_info!.variants.length - 1
              ].url

            return uploadXMedia(supabase, videoUrl)
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
    text: tweet.full_text.replace(/https:\/\/t\.co\/\S+\s*$/gm, '').trim() || undefined,
    media,
    published: tweet.created_at,
  }
}

export default defineApiRoute(async ({ event, supabase }) => {
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
      const telegramPostRegexp = /https?:\/\/(?:telegram|t)\.me\/(.+)\/(\d+)/gi
      const [, channelUsername, postId] = telegramPostRegexp.exec(url) || []

      const telegram = await initTelegramClient()

      const [authorAvatar, channelName, post] = await Promise.all([
        uploadTelegramMedia({
          supabase,
          telegram,
          channelUsername,
          type: 'profile_photo',
        }),
        getTelegramChannelName(telegram, channelUsername),
        getTelegramPostData(supabase, telegram, channelUsername, +postId),
      ])

      if (!post)
        throw createError({
          statusCode: 404,
          message: 'Пост не найден',
        })

      return {
        author: {
          avatar: authorAvatar || null,
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

      const post = await getXPostData(supabase, postId)

      return {
        author: post.author,
        text: post.text,
        media: post.media,
        published: post.published,
        type,
        url,
      }
    } catch (error: any) {
      throw createError({
        statusCode: 400,
        message: 'Ошибка получения поста',
      })
    }
  }
})
