import { fileTypeFromBuffer } from 'file-type'

export default async function getMimeTypeFromBuffer(
  buffer: Buffer | ArrayBuffer
) {
  return (await fileTypeFromBuffer(buffer))?.mime
}
