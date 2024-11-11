import type { Toast } from '~/types'

export function useToasts() {
  const toasts = useState<Toast[]>(() => [])

  function add({ title, text, duration = 3000, type }: Toast) {
    toasts.value.unshift({
      id: process.server ? useId() : window.crypto.randomUUID(),
      title,
      text,
      duration,
      type,
    })
  }

  function remove(id: Toast['id']) {
    const i = toasts.value.findIndex((toast: Toast) => toast.id === id)

    if (i !== -1) toasts.value.splice(i, 1)
  }

  return {
    toasts,
    add,
    remove,
    successToastify: ({ title, text, duration }: Toast) =>
      add({
        title,
        text,
        duration,
        type: 'success',
      }),
    errorToastify: ({ title, text, duration }: Toast) =>
      add({
        title,
        text,
        duration,
        type: 'error',
      }),
  }
}
