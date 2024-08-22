export default function calculateSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  targetRatio?: number
) {
  let width = originalWidth
  let height = originalHeight

  if (targetRatio) {
    width = Math.min(originalWidth, maxWidth)
    height = Math.round(width / targetRatio)

    if (height > maxHeight) {
      height = maxHeight
      width = Math.round(height * targetRatio)
    }
  } else {
    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight)
    width = Math.round(originalWidth * ratio)
    height = Math.round(originalHeight * ratio)
  }

  return { width, height }
}
