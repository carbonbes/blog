export default function isAllowedImgFormat(mimeType: string) {
  const allowedMimeTypes = [
    'image/png',
    'image/webp',
    'image/jpg',
    'image/jpeg',
    'image/gif',
  ]

  return allowedMimeTypes.includes(mimeType)
}
