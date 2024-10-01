import { readFile } from 'fs/promises'
import { Buffer } from 'buffer'

export default async function getBufferFromFile(filePath: string) {
  try {
    const data = await readFile(filePath)
    return Buffer.from(data)
  } catch (error: any) {
    throw new Error(`Failed to read file: ${error.message}`)
  }
}
