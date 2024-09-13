import type { MimeType } from 'file-type'

export const IMAGE_EXTENSIONS = [
  'png',
  'webp',
  'jpg',
  'jpeg',
  'tiff',
  'bmp',
  'heic',
]
export const GIF_EXTENSION = ['gif']
export const VIDEO_EXTENSIONS = ['mp4', 'quicktime', 'webm', 'x-flv', 'mpeg']
export const FILE_MAX_SIZE = 1024 * 1024 * 10
export const GALLERY_NODE_ALLOWED_MIME_TYPES: MimeType[] = [
  'image/png',
  'image/webp',
  'image/jpeg',
  'image/tiff',
  'image/bmp',
  'image/heic',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-flv',
  'video/mpeg',
]
