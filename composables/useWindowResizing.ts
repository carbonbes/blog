export default function useWindowResizing() {
  const isWindowResizing = useState('is-window-resizing', () => false)

  const { width, height } = useWindowSize()

  const debounced = useDebounceFn(() => {
    isWindowResizing.value = false
  }, 100)

  useEventListener(window, 'resize', () => {
    isWindowResizing.value = true
    debounced()
  })

  return { width, height, isWindowResizing }
}
