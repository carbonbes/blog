import { fileTypeFromBuffer } from 'file-type'

export default async function getMimeTypeFromBuffer(buffer: Buffer) {
  return (await fileTypeFromBuffer(buffer))?.mime
}
