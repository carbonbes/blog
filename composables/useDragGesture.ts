import {
  Gesture,
  type FullGestureState,
  type UserDragConfig,
} from '@use-gesture/vanilla'

export type DragState = Omit<FullGestureState<'drag'>, 'event'> & {
  event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent
}

type DragHandlers = {
  onDrag?: (state: DragState) => void
  onDragStart?: (state: DragState) => void
  onDragEnd?: (state: DragState) => void
}

type DragOptions = UserDragConfig & {
  onlyTouchDevices?: boolean
  manualInit?: boolean
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

  async function init() {
    await nextTick()

    if (!target.value) return

    const el = (target.value.$el || target.value) as EventTarget
    
    const { onDrag, onDragStart, onDragEnd } = handlers

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
  }

  onMounted(() => {
    if (options?.manualInit) return

    init()
  })

  return { init }
}
