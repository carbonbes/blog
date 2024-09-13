export default function getFileFromClipboard(e: ClipboardEvent) {
  if (e.clipboardData && e.clipboardData.files.length > 0) {
    const items = Array.from(e.clipboardData?.items)
    const files: File[] = []

    if (!items) return

    items.forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()

        if (file) {
          files.push(file)
        }
      }
    })

    return files
  }
}
