type Options = { id: number; title_slug: string }

export default function useEditorDialog() {
  const isOpen = useState(() => false)

  const router = useRouter()
  const route = useRoute()

  async function open(options?: Options) {
    await router.push({
      path: route.path,
      query: {
        dialog: 'editor',
        id: options?.id,
        title: options?.title_slug,
      },
      replace: true,
    })

    isOpen.value = true
  }

  async function close() {
    await router.push({ path: route.path, replace: true })
    isOpen.value = false
  }

  async function setOpen(value: boolean, options?: Options) {
    value ? await open(options) : await close()
  }

  watch(
    () => route.query.dialog === 'editor',
    (v) => (isOpen.value = v),
    { immediate: true }
  )

  watch(isOpen, (v) => {
    if (!v) router.push({ path: route.path, replace: true })
  })

  return { setOpen, isOpen }
}
