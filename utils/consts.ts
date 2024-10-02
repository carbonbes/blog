import type { MimeType } from 'file-type'

export const MEDIAFILE_MAX_SIZE = 1024 * 1024 * 100

export const ALLOWED_MEDIAFILE_MIME_TYPES: MimeType[] = [
  'image/png',
  'image/webp',
  'image/jpeg',
  'image/tiff',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-flv',
  'video/mpeg',
]

export const IMAGE_ROUTE = '/media/image/'
export const VIDEO_ROUTE = '/media/video/'
