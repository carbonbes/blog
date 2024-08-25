import {
  Gesture,
  type FullGestureState,
  type UserDragConfig,
} from '@use-gesture/vanilla'

type DragState = Omit<FullGestureState<'drag'>, 'event'> & {
  event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent
}

type DragHandlers = {
  onDrag?: (state: DragState) => void
  onDragStart?: (state: DragState) => void
  onDragEnd?: (state: DragState) => void
}

type DragOptions = UserDragConfig & {
  onlyTouchDevices?: boolean
}

export default function useDragGesture(
  target: Ref<MaybeRef>,
  handlers: DragHandlers,
  options?: DragOptions
) {
  const gesture = useState<Gesture | null>('gesture', () => null)

  function isAllowedEventType(event: Event): boolean {
    if (options?.onlyTouchDevices) {
      return (event as PointerEvent).pointerType === 'touch'
    }

    return true
  }

  function createEventHandler(handler?: (state: DragState) => void) {
    return (state: DragState) => {
      if (isAllowedEventType(state.event)) {
        handler?.(state)
      }
    }
  }

  watchEffect(() => {
    if (!target.value) return

    const { onDrag, onDragStart, onDragEnd } = handlers

    const el = (target.value.$el || target.value) as EventTarget

    gesture.value = new Gesture(
      el,
      {
        onDrag: createEventHandler(onDrag),
        onDragStart: createEventHandler(onDragStart),
        onDragEnd: createEventHandler(onDragEnd),
      },
      {
        drag: options,
      }
    )
  })

  onUnmounted(() => {
    if (gesture.value) {
      gesture.value.destroy()
      gesture.value = null
    }
  })
}
