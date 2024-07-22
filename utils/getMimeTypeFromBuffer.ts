export default function getMimeTypeFromBuffer(buffer: Buffer) {
  const uint8arr = new Uint8Array(buffer)
  const len = 4

  if (uint8arr.length >= len) {
    let signatureArr = new Array(len)

    for (let i = 0; i < len; i++) {
      signatureArr[i] = new Uint8Array(buffer)[i].toString(16)
    }

    const signature = signatureArr.join('').toUpperCase()

    switch (signature) {
      case '89504E47':
        return 'image/png'

      case '47494638':
        return 'image/gif'

      case 'FFD8FFDB':
      case 'FFD8FFE0':
        return 'image/jpeg'

      default:
        return null
    }
  }

  return null
}
