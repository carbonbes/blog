export default function useWindowResizing() {
  const isResizing = useState('is-resizing', () => false)

  const { width, height } = useWindowSize()

  const debounced = useDebounceFn(() => {
    isResizing.value = false
  }, 100)

  useEventListener(window, 'resize', () => {
    isResizing.value = true
    debounced()
  }, { passive: true })

  return { width, height, isResizing }
}
