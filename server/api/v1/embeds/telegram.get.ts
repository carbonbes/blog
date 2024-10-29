import { useSafeValidatedQuery, z } from 'h3-zod'
import { Api, TelegramClient } from 'telegram'
import { Supabase } from '~/types'
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

async function getChannelName(
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
  async ({ event }) => {
    const query = await useSafeValidatedQuery(event, { url: z.string().url() })

    if (!query.success) {
      throw createError({
        statusCode: 400,
        message: 'Укажите ссылку на пост в Telegram',
      })
    }

    const { url } = query.data

    const telegramPostRegexp = /https?:\/\/(?:telegram|t)\.me\/(.+)\/(\d+)/gi
    const [, channelUsername, postId] = telegramPostRegexp.exec(url) || []

    const telegram = await initTelegramClient()

    const channelName = await getChannelName(telegram, channelUsername)

    const [post] = await telegram.getMessages(channelUsername, {
      ids: new Api.InputMessageID({ id: +postId }),
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
      created_at: post.date,
      type: 'telegram',
      url,
    }
  },
  { requireAuth: true }
)
