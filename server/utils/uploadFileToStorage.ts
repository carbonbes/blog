import sharp from 'sharp'
import { Supabase } from '~/types'
import getFileTypeFromMimeType from '~/utils/getFileTypeFromMimeType'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'

const {
  public: { imageRoute, videoRoute },
} = useRuntimeConfig()

function getMediaRoute({
  fileName,
  type,
}: {
  fileName: string
  type: 'image' | 'video'
}) {
  return (type === 'image' ? imageRoute : videoRoute) + `/${fileName}`
}

export default async function uploadFileToStorage({
  supabase,
  file,
  description,
}: {
  supabase: Supabase
  file: Buffer
  description?: string
}) {
  const fileMimeType = await getMimeTypeFromBuffer(file)

  if (!fileMimeType) {
    throw createError({
      statusCode: 400,
      message: 'Не удалось распознать тип медиафайла',
    })
  }

  const inputFileType = getFileTypeFromMimeType(fileMimeType)

  if (!inputFileType) {
    throw createError({
      statusCode: 400,
      message: 'Файл не относится к медиафайлам',
    })
  }

  if (inputFileType === 'image') {
    const imageName = crypto.randomUUID()
    const { width: imageWidth, height: imageHeight } = await sharp(
      file
    ).metadata()

    if (!imageWidth || !imageHeight) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось распознать размеры изображения',
      })
    }

    const { data: storageImage, error: storageImageError } =
      await supabase.storage
        .from('media')
        .upload(imageName, file, { contentType: fileMimeType })

    if (storageImageError || !storageImage) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось загрузить файл',
      })
    }

    const { data, error } = await supabase
      .from('media_files')
      .insert({
        file: storageImage.id,
        name: imageName,
        url: getMediaRoute({ fileName: imageName, type: 'image' }),
        width: imageWidth,
        height: imageHeight,
        mime_type: fileMimeType,
        description,
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: +error.code,
        message: error.message,
      })
    }

    if (!data) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось занести данные о изображении в БД',
      })
    }

    return {
      name: data.name,
      url: data.url,
      width: data.width,
      height: data.height,
      mime_type: data.mime_type,
      description: data.description ?? undefined,
    }
  } else {
    const videoName = crypto.randomUUID()
    const thumbnailName = crypto.randomUUID()
    const thumbnail = await getScreenshotFromVideo(file)
    const thumbnailMimeType = await getMimeTypeFromBuffer(thumbnail)

    if (!thumbnailMimeType) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось распознать тип у превью видео',
      })
    }

    const { data: storageThumbnail, error: storageThumbnailError } =
      await supabase.storage
        .from('media')
        .upload(thumbnailName, thumbnail, { contentType: thumbnailMimeType })

    if (storageThumbnailError) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось загрузить превью у видео в хранилище',
      })
    }

    if (!storageThumbnail) {
      await supabase.storage.from('media').remove([thumbnailName])

      throw createError({
        statusCode: 400,
        message: 'Вернулся пустой файл превью из хранилища',
      })
    }

    const { data: storageVideo, error: storageVideoError } =
      await supabase.storage
        .from('media')
        .upload(videoName, file, { contentType: fileMimeType })

    if (storageVideoError) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось загрузить видео в хранилище',
      })
    }

    if (!storageVideo) {
      await supabase.storage.from('media').remove([videoName])

      throw createError({
        statusCode: 400,
        message: 'Вернулся пустой файл видео из хранилища',
      })
    }

    const { width: thumbnailWidth, height: thumbnailHeight } = await sharp(
      thumbnail
    ).metadata()

    const { data: thumbnailDb, error: thumbnailDbError } = await supabase
      .from('media_files')
      .insert({
        file: storageThumbnail.id,
        name: thumbnailName,
        url: getMediaRoute({ fileName: thumbnailName, type: 'image' }),
        width: thumbnailWidth,
        height: thumbnailHeight,
        mime_type: thumbnailMimeType,
      })
      .select()
      .single()

    if (thumbnailDbError) {
      throw createError({
        statusCode: +thumbnailDbError.code,
        message: thumbnailDbError.message,
      })
    }

    if (!thumbnailDb) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось занести данные о превью видео в БД',
      })
    }

    const {
      width: videoWidth,
      height: videoHeight,
      duration,
    } = await getVideoMetadata(file)

    const { data: videoDb, error: videoDbError } = await supabase
      .from('media_files')
      .insert({
        file: storageVideo.id,
        name: videoName,
        url: getMediaRoute({ fileName: videoName, type: 'video' }),
        thumbnail: thumbnailDb.id,
        width: videoWidth,
        height: videoHeight,
        duration,
        mime_type: fileMimeType,
        description,
      })
      .select('*, thumbnail(*)')
      .single()

    if (videoDbError) {
      throw createError({
        statusCode: +videoDbError.code,
        message: videoDbError.message,
      })
    }

    if (!videoDb) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось занести данные о видео в БД',
      })
    }

    return {
      name: videoDb.name,
      url: videoDb.url,
      width: videoDb.width,
      height: videoDb.height,
      duration: videoDb.duration,
      mime_type: videoDb.mime_type,
      description: videoDb.description ?? undefined,
      thumbnail: {
        name: videoDb.thumbnail.name,
        url: videoDb.thumbnail.url,
        width: videoDb.thumbnail.width,
        height: videoDb.thumbnail.height,
        mime_type: videoDb.thumbnail.mime_type,
      },
    }
  }
}
