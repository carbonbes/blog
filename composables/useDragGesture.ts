import {
  DragGesture,
  type FullGestureState,
  type UserDragConfig,
} from '@use-gesture/vanilla'

type DragState = Omit<FullGestureState<'drag'>, 'event'> & {
  event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent
}

export default function useDragGesture(
  target: Ref<MaybeRef>,
  callback: (state: DragState) => void,
  options?: UserDragConfig
) {
  const gesture = useState<DragGesture | null>('gesture', () => null)

  watchEffect(() => {
    if (!target.value) return

    const el = (target.value.$el || target.value) as EventTarget

    gesture.value = new DragGesture(
      el,
      (dragState) => {
        callback(dragState)
      },
      {
        axis: options?.axis || 'x',
      }
    )
  })

  onUnmounted(() => gesture.value?.destroy())
}
