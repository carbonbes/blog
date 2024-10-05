import sharp from 'sharp'
import { Supabase } from '~/types/index'
import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'

const {
  public: { imageRoute },
} = useRuntimeConfig()

export default async function uploadImageToStorage({
  supabase,
  image,
  description,
}: {
  supabase: Supabase
  image: Buffer
  description?: string
}) {
  const name = crypto.randomUUID()
  const { width, height } = await sharp(image).metadata()
  const mimeType = await getMimeTypeFromBuffer(image)

  if (!mimeType)
    throw createError({
      statusCode: 400,
      message: 'Не удалось распознать тип медиафайла',
    })

  const { data: storageFile, error: storageFileError } = await supabase.storage
    .from('media')
    .upload(name, image, { contentType: mimeType })

  if (storageFileError || !storageFile)
    throw createError({
      statusCode: 400,
      message: 'Не удалось загрузить файл',
    })

  const { data, error } = await supabase
    .from('media_files')
    .insert({
      file: storageFile.id,
      name,
      url: imageRoute + `/${name}`,
      width,
      height,
      mime_type: mimeType,
      description,
    })
    .select('name, url, width, height, mime_type, description')
    .single()

  if (error)
    throw createError({
      statusCode: +error.code,
      message: error.message,
    })

  return data
}
