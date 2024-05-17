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
  async function upload(filePath: string) {
    return await cloudinary.uploader.upload(filePath)
  }

  return { upload }
}
