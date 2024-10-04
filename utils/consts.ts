import type { MimeType } from 'file-type'

export const MEDIAFILE_MAX_SIZE = 1024 * 1024 * 100

export const ALLOWED_MEDIAFILE_MIME_TYPES: MimeType[] = [
  'image/png',
  'image/webp',
  'image/jpeg',
  'image/tiff',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/x-flv',
  'video/mpeg',
]
