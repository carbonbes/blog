export default function useEditorDialog(dialogRef: Ref) {
  const router = useRouter()
  const route = useRoute()

  function open() {
    dialogRef.value?.setOpen(true)
    router.push({
      path: route.path,
      query: { dialog: 'editor' },
      replace: true,
    })
  }

  function close() {
    dialogRef.value?.setOpen(false)
    router.push({ path: route.path, replace: true })
  }

  function setOpen(value: boolean) {
    if (value) open()
    else close()
  }

  watchEffect(() => {
    if (route.query.dialog === 'editor') {
      open()
    } else {
      close()
    }
  })

  return { setOpen }
}
