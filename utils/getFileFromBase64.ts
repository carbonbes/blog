export default async function getFileFromBase64(value: string) {
  const byteString = atob(value.split(',')[1])

  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }

  const type = await getMimeTypeFromBuffer(uint8Array)

  return new File([arrayBuffer], '', { type })
}
