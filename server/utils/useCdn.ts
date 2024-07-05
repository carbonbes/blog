import { v2 as cloudinary } from 'cloudinary'

const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret } =
  useRuntimeConfig()

cloudinary.config({
  secure: true,
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
})

export default function useCdn() {
  async function upload(
    filePath: string,
    options?: { withMetadata?: boolean }
  ) {
    return await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      media_metadata: options?.withMetadata,
    })
  }

  return { upload }
}
