import type { EmbedType } from '~/types'

export default function getEmbedType(url: string): EmbedType | undefined {
  const telegramRegexp = /(?:https?:\/\/)?(?:www\.)?t\.me\/.+/gi
  const xRegexp = /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+/gi
  const youtubeRegexp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/gi

  if (telegramRegexp.test(url)) {
    return 'telegram'
  } else if (xRegexp.test(url)) {
    return 'x'
  } else if (youtubeRegexp.test(url)) {
    return 'youtube'
  }
}
