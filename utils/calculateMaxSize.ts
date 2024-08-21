export default function calculateMaxSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight)

  const width = Math.round(originalWidth * ratio)
  const height = Math.round(originalHeight * ratio)

  return { width, height }
}
