export default function useEditorDialog(dialogRef: Ref) {
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
    if (value) open()
    else close()
  }

  watchEffect(() => {
    if (route.query.dialog === 'editor') dialogRef.value?.setOpen(true)
    else dialogRef.value?.setOpen(false)
  })

  return { setOpen }
}
