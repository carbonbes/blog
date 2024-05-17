import type { Notification } from '~/types'

export function useNotifications() {
  const notifications = useState<Notification[]>('notifications', () => [])

  function add({ title, text, duration = 3000, type }: Notification) {
    notifications.value.unshift({
      id: process.server ? useId() : window.crypto.randomUUID(),
      title,
      text,
      duration,
      type,
    })
  }

  function remove(id: Notification['id']) {
    const i = notifications.value.findIndex(
      (notification: Notification) => notification.id === id
    )

    if (i !== -1) notifications.value.splice(i, 1)
  }

  return {
    notifications,
    add,
    remove,
    successNotify: ({ title, text, duration }: Notification) =>
      add({
        title,
        text,
        duration,
        type: 'success',
      }),
    errorNotify: ({ title, text, duration }: Notification) =>
      add({
        title,
        text,
        duration,
        type: 'error',
      }),
  }
}
