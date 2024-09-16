export default function getFrameFromBase64Video(value: string) {
  return new Promise<string>((resolve, reject) => {
    const video = document.createElement('video')
    video.src = value
    video.currentTime = 0.1

    video.onloadeddata = () => {
      const canvas = document.createElement('canvas')
      const width = video.videoWidth
      const height = video.videoHeight
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d')
      context?.drawImage(video, 0, 0, width, height)

      resolve(canvas.toDataURL('image/png'))
    }

    video.onerror = (error) => {
      reject(error)
    }
  })
}
