import {
  DragGesture,
  type FullGestureState,
  type UserDragConfig,
} from '@use-gesture/vanilla'

type DragState = Omit<FullGestureState<'drag'>, 'event'> & {
  event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent
}

export default function useDragGesture(
  el: HTMLElement | undefined,
  options?: UserDragConfig
) {
  const gesture = useState<DragGesture | null>('gesture', () => null)
  const state = useState<DragState | null>('state', () => null)

  onMounted(() => {
    gesture.value = new DragGesture(
      el,
      (dragState) => {
        state.value = dragState

        console.log(el)
      },
      {
        axis: options?.axis || 'x',
      }
    )
  })

  onUnmounted(() => gesture.value?.destroy())

  return state
}
