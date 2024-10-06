import getMimeTypeFromBuffer from '~/utils/getMimeTypeFromBuffer'

export default async function getFileFromBuffer(buffer: Buffer) {
  const mimeType = await getMimeTypeFromBuffer(buffer)

  if (!mimeType) return

  const blob = new Blob([buffer], { type: mimeType })

  return new File([blob], '', { type: mimeType })
}
