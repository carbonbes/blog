<template>
  <Teleport to=".editor">
    <FadeTransition>
      <div v-if="state.controlsIsShow" :style="floatingStyles" ref="nodeControlsRef">
        <Flex itemsCenter class="gap-1">
          <EditorNodeActionsButton
            :selectedNode="selectedNode"
            @isOpen="onNodeActionsOpen"
          />
        </Flex>
      </div>
    </FadeTransition>
  </Teleport>
</template>

<script lang="ts" setup>
import { autoUpdate, offset, useFloating } from '@floating-ui/vue'
import type { Node } from '@tiptap/pm/model'
import type { NodeSelection } from '@tiptap/pm/state'
import EditorNodeActionsButton from '~/components/editor/node-controls/EditorNodeActionsButton.vue'
import EditorNodesListButton from '~/components/editor/node-controls/EditorNodesListButton.vue'

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
  middleware: [offset(15)],
  whileElementsMounted: autoUpdate
})

const hoveredNodeRect = ref<DOMRect>()
const selectedNode = ref<Node>()

const { editor } = useEditor()

function onNodeActionsOpen(value: boolean) {
  state.actionsDropdownIsOpen = value

  if (value) {
    const pos = nodeDOMAtCoords({
      x: hoveredNodeRect.value!.x,
      y: hoveredNodeRect.value!.y
    })?.pmViewDesc?.posAtStart! - 1

    editor.value?.commands.setNodeSelection(pos)
    const selection = editor.value?.state.selection as NodeSelection
    selectedNode.value = selection.node
  } else {
    editor.value?.commands.setTextSelection(0)
    selectedNode.value = undefined
  }
}

onMounted(async () => {
  await nextTick()

  useEventListener(document.querySelector('.editor'), 'mousemove', (e: MouseEvent) => {
    if (state.actionsDropdownIsOpen || state.nodesListDropdownIsOpen) return

    const node = nodeDOMAtCoords({
      x: e.clientX + 75,
      y: e.clientY
    })

    hoveredNodeRect.value = node?.getBoundingClientRect()

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
