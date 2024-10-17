import type Dialog from '~/components/global/Dialog.vue'

type Options = { id: number; title_slug: string }

export default function useEditorDialog(
  dialogRef?: Ref<InstanceType<typeof Dialog> | undefined>
) {
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

  watchEffect(() => {
    if (!dialogRef?.value) return

    dialogRef.value.setOpen(route.query.dialog === 'editor')
  })

  return { setOpen, isOpen }
}
