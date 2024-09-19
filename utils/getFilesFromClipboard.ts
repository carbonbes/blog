import type { MimeType } from 'file-type'

export default function getFilesFromClipboard(
  e: ClipboardEvent,
  types?: MimeType[]
): File[] | undefined {
  if (e.clipboardData && e.clipboardData.files.length > 0) {
    const items = Array.from(e.clipboardData.items)
    let files: File[] | undefined = undefined

    if (!items) return

    items.forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()

        if (file && (!types || (types as string[]).includes(file.type))) {
          if (!files) files = []
          files.push(file)
        }
      }
    })

    return files
  }
}
