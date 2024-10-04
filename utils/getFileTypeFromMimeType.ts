export default function getFileTypeFromMimeType(value: string) {
  if (value.startsWith('image/')) {
    return 'image'
  } else if (value.startsWith('video/')) {
    return 'video'
  }
}
