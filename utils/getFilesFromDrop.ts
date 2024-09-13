export default function getFilesFromDrop(e: DragEvent) {
  e.preventDefault()

  const files: File[] = []

  if (e.dataTransfer?.items) {
    Array.from(e.dataTransfer.items).forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) {
          files.push(file)
        }
      }
    })

    return files
  } else if (e.dataTransfer?.files) {
    Array.from(e.dataTransfer.files).forEach((file) => {
      files.push(file)
    })

    return files
  }
}
