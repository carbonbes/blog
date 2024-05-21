<template>
  <Teleport to=".editor">
    <FadeTransition>
      <div
        :style="floatingStyles"
        ref="nodeControlsRef"
        v-if="state.controlsIsShow"
      >
        <Flex itemsCenter>
          <EditorNodeActionsButton @is-open="(value) => state.actionsDropdownIsOpen = value" />
        </Flex>
      </div>
    </FadeTransition>
  </Teleport>
</template>

<script lang="ts" setup>
import { autoUpdate, flip, limitShift, offset, shift, useFloating } from '@floating-ui/vue'
import EditorNodeActionsButton from './EditorNodeActionsButton.vue'
import EditorNodesListButton from './EditorNodesListButton.vue'

const state: {
  controlsIsShow: boolean
  nodesListDropdownIsOpen: boolean
  actionsDropdownIsOpen: boolean
} = reactive({
  controlsIsShow: false,
  nodesListDropdownIsOpen: false,
  actionsDropdownIsOpen: false,
})

function nodeDOMAtCoords(coords: { x: number, y: number }) {
  return document
    .elementsFromPoint(coords.x, coords.y)
    .find((elem: Element) => elem.parentElement?.matches?.('.tiptap'))
}

const nodeControlsRef = ref()
const hoveredNodeRect = ref()
const selectedNode = ref()
const floatingRect = ref<{
  getBoundingClientRect(): {
    x: number
    y: number
    top: number
    left: number
    bottom: number
    right: number
    width: number
    height: number
  }
}>()

const { floatingStyles } = useFloating(floatingRect, nodeControlsRef, {
  placement: 'left-start',
  middleware: [shift({ padding: { top: 0 }, limiter: limitShift() }), flip(), offset(15)],
  whileElementsMounted: autoUpdate
})

onMounted(async () => {
  await nextTick()

  useEventListener(document.querySelector('.editor'), 'mousemove', (e: MouseEvent) => {
    if (state.actionsDropdownIsOpen || state.nodesListDropdownIsOpen) return

    const node = nodeDOMAtCoords({
      x: e.clientX + 75,
      y: e.clientY
    })

    const nodeRect = node?.getBoundingClientRect()

    hoveredNodeRect.value = nodeRect

    state.controlsIsShow = !!node

    const rect = useElementBounding(node)

    floatingRect.value = {
      getBoundingClientRect() {
        return {
          x: rect.x.value,
          y: rect.y.value,
          top: rect.top.value,
          left: rect.left.value,
          bottom: rect.bottom.value,
          right: rect.right.value,
          width: rect.width.value,
          height: rect.height.value,
        }
      }
    }
  })

  useEventListener(document.querySelector('.editor'), 'mouseleave', () => {
    if (state.actionsDropdownIsOpen || state.nodesListDropdownIsOpen) return

    if (state.controlsIsShow) state.controlsIsShow = false
  })
})
</script>
