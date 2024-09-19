import type { MimeType } from 'file-type'

export default function getFilesFromDrop(
  e: DragEvent,
  types?: MimeType[]
) {
  e.preventDefault()

  let files: File[] = []

  if (e.dataTransfer?.items) {
    Array.from(e.dataTransfer.items).forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file && (!types || (types as string[]).includes(file.type))) {
          files.push(file)
        }
      }
    })
  } else if (e.dataTransfer?.files) {
    Array.from(e.dataTransfer.files).forEach((file) => {
      if (!types || (types as string[]).includes(file.type)) {
        files.push(file)
      }
    })
  }

  return files.length > 0 ? files : undefined
}
