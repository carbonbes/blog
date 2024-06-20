import type { EmbedType } from '~/types'

export default function getEmbedType(url: string): EmbedType {
  const telegramRegexp = /(?:https?:\/\/)?(?:www\.)?t\.me\/.+/gi
  const tweetRegexp = /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+/gi
  const youtubeRegexp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/gi

  if (telegramRegexp.test(url)) {
    return 'telegram'
  } else if (tweetRegexp.test(url)) {
    return 'twitter'
  } else if (youtubeRegexp.test(url)) {
    return 'youtube'
  }
}
