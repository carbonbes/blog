import { Supabase } from '~/types'
import getVideoMetadata from '~/server/utils/getVideoMetadata'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'
import getScreenshotFromVideo from '~/server/utils/getScreenshotFromVideo'
import { MimeType } from 'file-type'
import sharp from 'sharp'

const {
  public: { imageRoute, videoRoute },
} = useRuntimeConfig()

async function upload({
  supabase,
  file,
  name,
  mimeType,
  isThumbnail,
}: {
  supabase: Supabase
  file: Buffer
  name: string
  mimeType: MimeType
  isThumbnail: boolean
}) {
  const { data, error } = await supabase.storage
    .from('media')
    .upload(name, file, { contentType: mimeType })

  if (error || !data)
    throw createError({
      statusCode: 500,
      message: error.message,
    })

  return {
    id: data.id,
    url: (isThumbnail ? imageRoute : videoRoute) + `/${name}`,
  }
}

export default async function uploadVideoToStorage({
  supabase,
  video,
  description,
}: {
  supabase: Supabase
  video: Buffer
  description?: string
}) {
  const videoName = crypto.randomUUID()
  const thumbnailName = crypto.randomUUID()
  const videoMimeType = await getMimeTypeFromBuffer(video)

  if (!videoMimeType)
    throw createError({
      statusCode: 400,
      message: 'Не удалось распознать тип медиафайла',
    })

  const thumbnail = await getScreenshotFromVideo(video)
  const thumbnailMimetype = await getMimeTypeFromBuffer(thumbnail)

  if (!thumbnailMimetype)
    throw createError({
      statusCode: 400,
      message: 'Не удалось распознать тип у превью видео',
    })

  const [
    { id: videoId, url: videoUrl },
    { id: thumbnailId, url: thumbnailUrl },
  ] = await Promise.all([
    upload({
      supabase,
      file: video,
      name: videoName,
      mimeType: videoMimeType,
      isThumbnail: false,
    }),
    upload({
      supabase,
      file: thumbnail,
      name: thumbnailName,
      mimeType: thumbnailMimetype,
      isThumbnail: true,
    }),
  ])

  const {
    width: videoWidth,
    height: videoHeight,
    duration,
  } = await getVideoMetadata(video)

  const { width: thumbnailWidth, height: thumbnailHeight } = await sharp(
    thumbnail
  ).metadata()

  if (!thumbnailWidth || !thumbnailHeight)
    throw createError({
      statusCode: 400,
      message: 'Не удалось распознать размеры у превью видео',
    })

  const { data: thumbnailDb, error: thumbnailDbError } = await supabase
    .from('media_files')
    .insert({
      file: thumbnailId,
      name: thumbnailName,
      url: thumbnailUrl,
      width: thumbnailWidth,
      height: thumbnailHeight,
      mime_type: thumbnailMimetype,
    })
    .select()
    .single()

  if (thumbnailDbError || !thumbnailDb)
    throw createError({
      statusCode: 500,
      message: thumbnailDbError?.message,
    })

  const { data: videoDb, error: videoDbError } = await supabase
    .from('media_files')
    .insert({
      file: videoId,
      name: videoName,
      url: videoUrl,
      thumbnail: thumbnailDb.id,
      width: videoWidth,
      height: videoHeight,
      duration,
      mime_type: videoMimeType,
      description,
    })
    .select(
      `
      name,
      url,
      thumbnail (
        name,
        url,
        width,
        height,
        mime_type
      ),
      width,
      height,
      duration,
      mime_type,
      description
    `
    )
    .single()

  if (videoDbError || !videoDb)
    throw createError({
      statusCode: 500,
      message: videoDbError?.message,
    })

  return {
    ...videoDb,
    description: description ?? undefined,
  }
}
