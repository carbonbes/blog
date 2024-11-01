import { Supabase, StorageMedia } from '~/types'
import { useSafeValidatedQuery, z } from 'h3-zod'
import { Api, TelegramClient } from 'telegram'
import getFileFromBuffer from '~/utils/getFileFromBuffer'
import { StringSession } from 'telegram/sessions/index.js'

type TelegramMediaArgs =
  | {
      supabase: Supabase
      telegram: TelegramClient
      channelUsername: string
      type: 'userAvatar'
    }
  | {
      supabase: Supabase
      telegram: TelegramClient
      media: Api.TypeMessageMedia
      type: 'postMedia'
    }

const { telegramApiId, telegramApiHash, telegramApiStringSession } =
  useRuntimeConfig()

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

async function getMedia(args: TelegramMediaArgs) {
  const { supabase, telegram } = args

  const buffer =
    args.type === 'postMedia'
      ? ((await telegram.downloadMedia(args.media)) as Buffer | undefined)
      : ((await telegram.downloadProfilePhoto(args.channelUsername)) as
          | Buffer
          | undefined)

  if (!buffer) return

  const file = await getFileFromBuffer(buffer)

  if (!file) return

  return await uploadFileToStorage({ supabase, file: buffer })
}

export default defineApiRoute(
  async ({ event, supabase }) => {
    const query = await useSafeValidatedQuery(event, { url: z.string().url() })

    if (!query.success) {
      throw createError({
        statusCode: 400,
        message: 'Укажите ссылку на пост в Telegram',
      })
    }

    const { url } = query.data

    const telegramPostRegexp = /https?:\/\/(?:telegram|t)\.me\/(.+)\/(\d+)/i

    if (!telegramPostRegexp.test(url)) {
      throw createError({
        statusCode: 400,
        message: 'Некорректная ссылка на пост',
      })
    }

    const [, channelUsername, postId] = telegramPostRegexp.exec(url) || []

    try {
      const telegram = await initTelegramClient()

      const { title: channelName, verified } = (await telegram.getEntity(
        channelUsername
      )) as Api.Channel

      const authorAvatar = await getMedia({
        supabase,
        telegram,
        channelUsername,
        type: 'userAvatar',
      })

      const [post] = await telegram.getMessages(channelUsername, {
        ids: new Api.InputMessageID({ id: +postId }),
      })

      let media: StorageMedia[] | undefined = undefined

      if (post.media) {
        if (post.groupedId) {
          const ids: number[] = []

          for (let i = +postId + 1; i <= +postId + 10; i++) {
            ids.push(i)
          }

          const posts = (
            await telegram.getMessages(channelUsername, {
              ids,
            })
          ).filter(
            (gPost) => Number(gPost?.groupedId) === Number(post.groupedId)
          )

          posts.unshift(post)

          const mediaForUpload = [
            post.media,
            ...posts.map((post) => post.media),
          ]

          media = (
            await Promise.all(
              mediaForUpload.map(async (media) => {
                if (!media) return

                const mediaItem = await getMedia({
                  supabase,
                  telegram,
                  media,
                  type: 'postMedia',
                })

                if (!mediaItem) return

                return mediaItem
              })
            )
          ).filter((media) => !!media)
        } else {
          const mediaItem = await getMedia({
            supabase,
            telegram,
            media: post.media,
            type: 'postMedia',
          })

          if (!mediaItem) return

          media = [mediaItem]
        }
      }

      return {
        author: {
          avatar: authorAvatar,
          name: channelName,
          username: channelUsername,
          verified: verified ?? false,
          url: `https://t.me/${channelUsername}`,
        },
        text: post.text,
        media,
        created_at: post.date * 1000,
        type: 'telegram',
        url,
      }
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось получить пост',
      })
    }
  },
  { requireAuth: true }
)
