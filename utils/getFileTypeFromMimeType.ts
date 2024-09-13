export default function getFileTypeFromMimeType(value: string) {
  if (value === 'image/gif') {
    return 'gif'
  } else if (value.startsWith('image/') && value !== 'image/gif') {
    return 'image'
  } else if (value.startsWith('video/')) {
    return 'video'
  }
}
