export default async function getBase64FromBuffer(
  buffer: Buffer | ArrayBuffer
): Promise<string> {
  const mimeType = await getMimeTypeFromBuffer(buffer)

  const finalBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)

  return `data:${mimeType};base64,` + finalBuffer.toString('base64')
}
