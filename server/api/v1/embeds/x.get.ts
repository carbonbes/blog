import { StorageMedia, Supabase } from '~/types'
import { useSafeValidatedQuery, z } from 'h3-zod'
import { getTweet } from 'react-tweet/api'

async function getMedia(supabase: Supabase, url: string) {
  const blob = await $fetch<any>(url)

  if (!blob || !(blob instanceof Blob))
    throw createError({
      statusCode: 400,
      message: 'Не удалось скачать медиафайл',
    })

  const buffer = Buffer.from(await blob.arrayBuffer())

  return await uploadFileToStorage({ supabase, file: buffer })
}

export default defineApiRoute(
  async ({ event, supabase }) => {
    try {
      const query = await useSafeValidatedQuery(event, {
        url: z.string().url(),
      })

      if (!query.success) {
        throw createError({
          statusCode: 400,
          message: 'Укажите ID поста в X.com',
        })
      }

      const { url } = query.data

      const tweetIdRegexp =
        /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+\/([0-9]{0,19})/i

      if (!tweetIdRegexp.test(url)) {
        throw createError({
          statusCode: 400,
          message: 'Некорректная ссылка на пост',
        })
      }

      const [, postId] = tweetIdRegexp.exec(url) || []

      const tweet = await getTweet(postId)

      if (!tweet) {
        throw createError({
          statusCode: 404,
          message: 'Пост не найден',
        })
      }

      const authorAvatar = await getMedia(
        supabase,
        tweet.user.profile_image_url_https
      )

      let media: StorageMedia[] | undefined = undefined

      if (tweet.mediaDetails) {
        media = (
          await Promise.all(
            tweet.mediaDetails.map(async (tweetMedia) => {
              return await getMedia(supabase, tweetMedia.media_url_https)
            })
          )
        ).filter((media) => !!media)
      }

      const { name: authorName, screen_name: authorScreenName } = tweet.user

      return {
        author: {
          avatar: authorAvatar,
          name: authorName,
          username: authorScreenName,
          url: `https://x.com/${authorScreenName}`,
        },
        text:
          tweet.text.replace(/https:\/\/t\.co\/\S+\s*$/gm, '').trim() ||
          undefined,
        media,
        created_at: tweet.created_at,
        type: 'x',
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
