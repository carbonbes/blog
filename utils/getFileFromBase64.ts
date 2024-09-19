export default async function getFileFromBase64(
  value: string
): Promise<File | null> {
  try {
    const [header, base64Data] = value.split(',')

    if (!header || !base64Data) {
      throw new Error('Некорректный формат Base64 строки')
    }

    const byteString = atob(base64Data)

    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i)
    }

    const type = await getMimeTypeFromBuffer(uint8Array)

    return new File([arrayBuffer], 'file', { type })
  } catch (error) {
    console.error('Ошибка при конвертации Base64 в файл:', error)
    return null
  }
}
