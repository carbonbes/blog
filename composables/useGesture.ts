import {
  type CommonGestureState,
  type EventTypes,
  type FullGestureState,
  type UserGestureConfig,
  Gesture,
} from '@use-gesture/vanilla'

export type DragGestureState = Omit<FullGestureState<'drag'>, 'event'> & {
  event: EventTypes['drag']
}

export type PinchGestureState = Omit<FullGestureState<'pinch'>, 'event'> & {
  event: EventTypes['pinch']
}

export type ScrollGestureState = Omit<FullGestureState<'scroll'>, 'event'> & {
  event: EventTypes['scroll']
}

export type MoveGestureState = Omit<FullGestureState<'move'>, 'event'> & {
  event: EventTypes['move']
}

export type WheelGestureState = Omit<FullGestureState<'wheel'>, 'event'> & {
  event: EventTypes['wheel']
}

export type HoverGestureState = Omit<FullGestureState<'hover'>, 'event'> & {
  event: EventTypes['hover']
}

type GestureHandlers = {
  onDrag?: (state: DragGestureState) => void
  onDragStart?: (state: DragGestureState) => void
  onDragEnd?: (state: DragGestureState) => void
  onPinch?: (state: PinchGestureState) => void
  onPinchStart?: (state: PinchGestureState) => void
  onPinchEnd?: (state: PinchGestureState) => void
  onScroll?: (state: ScrollGestureState) => void
  onScrollStart?: (state: ScrollGestureState) => void
  onScrollEnd?: (state: ScrollGestureState) => void
  onMove?: (state: MoveGestureState) => void
  onMoveStart?: (state: MoveGestureState) => void
  onMoveEnd?: (state: MoveGestureState) => void
  onWheel?: (state: WheelGestureState) => void
  onWheelStart?: (state: WheelGestureState) => void
  onWheelEnd?: (state: WheelGestureState) => void
  onHover?: (state: HoverGestureState) => void
}

type GestureOptions = UserGestureConfig & {
  onlyTouchDevices?: boolean
}

export default function useGesture(
  target: MaybeRefOrGetter<HTMLElement | SVGElement | ComponentPublicInstance | null | undefined>,
  handlers: GestureHandlers,
  options?: GestureOptions
) {
  const gesture = useState<Gesture | null>('gesture', () => null)

  function isAllowedEventType(event: Event): boolean {
    if (options?.onlyTouchDevices) {
      return (event as PointerEvent).pointerType === 'touch'
    }

    return true
  }

  function createEventHandler<T>(handler?: (state: T) => void) {
    return (state: T & CommonGestureState) => {
      if (isAllowedEventType(state.event)) {
        handler?.(state)
      }
    }
  }

  async function init() {
    await nextTick()

    let el

    if (typeof target === 'function') {
      el = (target as () => HTMLElement | SVGElement)()
    } else if (isRef(target)) {
      if ((target.value as ComponentPublicInstance).$el) {
        el = (target.value as ComponentPublicInstance).$el as HTMLElement | SVGElement
      } else if (target.value instanceof HTMLElement || target instanceof SVGElement) {
        el = target.value
      }
    }

    const { onlyTouchDevices, ...gestureOptions } = options || {}

    gesture.value = new Gesture(
      el as EventTarget,
      {
        onDrag: createEventHandler<DragGestureState>(handlers.onDrag),
        onDragStart: createEventHandler<DragGestureState>(handlers.onDragStart),
        onDragEnd: createEventHandler<DragGestureState>(handlers.onDragEnd),
        onPinch: createEventHandler<PinchGestureState>(handlers.onPinch),
        onPinchStart: createEventHandler<PinchGestureState>(handlers.onPinchStart),
        onPinchEnd: createEventHandler<PinchGestureState>(handlers.onPinchEnd),
        onScroll: createEventHandler<ScrollGestureState>(handlers.onScroll),
        onScrollStart: createEventHandler<ScrollGestureState>(handlers.onScrollStart),
        onScrollEnd: createEventHandler<ScrollGestureState>(handlers.onScrollEnd),
        onMove: createEventHandler<MoveGestureState>(handlers.onMove),
        onMoveStart: createEventHandler<MoveGestureState>(handlers.onMoveStart),
        onMoveEnd: createEventHandler<MoveGestureState>(handlers.onMoveEnd),
        onWheel: createEventHandler<WheelGestureState>(handlers.onWheel),
        onWheelStart: createEventHandler<WheelGestureState>(handlers.onWheelStart),
        onWheelEnd: createEventHandler<WheelGestureState>(handlers.onWheelEnd),
        onHover: createEventHandler<HoverGestureState>(handlers.onHover),
      },
      gestureOptions
    )
  }

  tryOnMounted(() => {
    try {
      init()
    } catch (e) {
      console.error(e)
    }
  })
}
