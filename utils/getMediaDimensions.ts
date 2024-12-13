export default async function getMediaDimensions(
  media: Blob
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const mimetype = media.type
    const group = getFileTypeFromMimeType(mimetype)

    if (!group) return

    const mediaURL = URL.createObjectURL(media)

    if (group === 'image') {
      const image = document.createElement('img')
      image.src = mediaURL

      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight })
      }

      image.onerror = () => {
        reject(new Error('Не удалось загрузить изображение'))
      }
    } else {
      const video = document.createElement('video')
      video.src = mediaURL

      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight })
      }

      video.onerror = () => {
        reject(new Error('Не удалось загрузить видео'))
      }
    }
  })
}
