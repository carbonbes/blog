import { promiseTimeout } from '@vueuse/core'

export default function useDrawer() {
  const isOpen = useState(() => false)

  async function setOpen(value: boolean) {
    await promiseTimeout(0)

    isOpen.value = value
  }

  return { isOpen, setOpen }
}
