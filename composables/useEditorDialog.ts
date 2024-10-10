import type Dialog from '~/components/global/Dialog.vue'
import type { Article } from '~/types'

export default function useEditorDialog(
  dialogRef?: Ref<InstanceType<typeof Dialog> | undefined>
) {
  const router = useRouter()
  const route = useRoute()

  function open() {
    router.push({
      path: route.path,
      query: { dialog: 'editor' },
      replace: true,
    })
  }

  function close() {
    router.push({ path: route.path, replace: true })
  }

  function setOpen(value: boolean) {
    value ? open() : close()
  }

  watchEffect(() => {
    if (!dialogRef?.value) return

    dialogRef.value.setOpen(route.query.dialog === 'editor')
  })

  const state = useState(
    (): {
      status: Article['status']
      pending: boolean
    } =>
      reactive({
        status: 'draft',
        pending: false,
      })
  )

  return { setOpen, state }
}
