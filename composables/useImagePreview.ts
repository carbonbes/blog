import { promiseTimeout } from '@vueuse/core'

export default function useUseImagePreview() {
  const previewIsOpen = useState('preview-is-open', () => false)

  async function setPreviewOpen(value: boolean) {
    if (!value) {
      await promiseTimeout(100)
      previewIsOpen.value = false

      return
    }

    previewIsOpen.value = true
  }

  function togglePreviewOpen() {
    previewIsOpen.value = !previewIsOpen.value
  }

  return { previewIsOpen, setPreviewOpen, togglePreviewOpen }
}
