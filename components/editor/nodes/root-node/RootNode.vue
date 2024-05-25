<template>
  <NodeViewWrapper :class="nodeClasses" data-type="root-node">
    <Flex :class="nodeControlsClasses">
      <button>
        <ITablerPlus />
      </button>
      <button>
        <ITablerGripVertical />
      </button>
    </Flex>

    <Flex
      :class="nodeContentWrapperClasses"
      :style="{ transform: transformX }"
      ref="nodeContentRef"
    >
      <Flex itemsCenter class="absolute right-full h-full sm:hidden">
        <ITablerPlus />
      </Flex>

      <NodeViewContent :class="nodeContentClasses" />

      <Flex itemsCenter class="absolute left-full h-full sm:hidden">
        <ITablerArrowUp />
        <ITablerArrowDown />
      </Flex>
    </Flex>

    <Flex :class="nodeQuickActionsClasses">
      <ITablerPin />
      <ITablerEyeOff />
    </Flex>

    <NodesListBottomsheet ref="nodesListBHRef" />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/vue-3'
import NodesListBottomsheet from '~/components/editor/nodes/root-node/nodes-list-bottomsheet/NodesListBottomsheet.vue'

const props = defineProps<NodeViewProps>()

const state = reactive({})

const { selectionIsEmpty } = useEditor()
const { nodeIsSwiping } = useEditorDialog()

const nodeClasses = computed(() => ({
  'flex gap-4 [&.heading-1]:text-2xl [&.heading-1]:font-bold [&.heading-2]:text-xl [&.heading-2]:font-bold not-first:[&.paragraph]:mt-4 not-first:[&.orderedList]:mt-4 not-first:[&.bulletList]:mt-4 not-first:[&.heading]:mt-6 group/node': true,
  [props.node.content.content[0].type.name]: true,
  ['heading-' + props.node.content.content[0].attrs.level]: props.node.content.content[0].type.name === 'heading',
}))

const nodeControlsClasses = computed(() => ({
  'sm:items-center gap-2 self-start hidden sm:flex sm:[&>*]:opacity-0 sm:group-hover/node:[&>*]:opacity-100 [&>*]:transition-opacity': true,
}))

const nodeContentWrapperClasses = computed(() => ({
  'relative w-full': true,
  'transition-transform': !isSwiping.value
}))

const nodeContentClasses = computed(() => ({
  'w-full [&_ol]:pl-4 [&_ul]:pl-4 [&_ol]:list-decimal [&_ul]:list-disc outline-none': true,
}))

const nodeQuickActionsClasses = computed(() => ({
  'sm:items-center gap-2 self-start hidden sm:flex sm:[&>*]:opacity-0 sm:group-hover/node:[&>*]:opacity-100 [&>*]:transition-opacity': true,
}))

const nodeContentRef = ref<HTMLDivElement>()
const nodesListBHRef = ref<InstanceType<typeof NodesListBottomsheet>>()

const transformX = ref('0')

const { isSwiping, direction, lengthX } = useSwipe(nodeContentRef, {
  threshold: 25,

  onSwipe() {
    if (!selectionIsEmpty.value) return

    if (direction.value === 'right') {
      if (lengthX.value < 0) {
        const length = Math.abs(lengthX.value)
        transformX.value = `translateX(${length}px)`
        nodeIsSwiping.value = true
      } else {
        transformX.value = 'translateX(0)'
        nodeIsSwiping.value = false
      }
    } else {
      if (lengthX.value > 0) {
        const length = Math.abs(lengthX.value)
        transformX.value = `translateX(-${length}px)`
        nodeIsSwiping.value = true
      } else {
        transformX.value = 'translateX(0)'
        nodeIsSwiping.value = false
      }
    }
  },

  onSwipeEnd() {
    if (!selectionIsEmpty.value) return

    if (direction.value === 'right') {
      if (lengthX.value < 0 && nodeContentRef.value?.$el.clientWidth && (Math.abs(lengthX.value) / nodeContentRef.value?.$el.clientWidth) >= 0.25) {
        transformX.value = 'translateX(0)'
        nodesListBHRef.value?.setOpen(true)
      } else {
        transformX.value = 'translateX(0)'
        nodeIsSwiping.value = false
      }
    } else {
      if (lengthX.value > 0 && nodeContentRef.value?.$el.clientWidth && (Math.abs(lengthX.value) / nodeContentRef.value?.$el.clientWidth) >= 0.25) {
        transformX.value = 'translateX(-75%)'
      } else {
        transformX.value = 'translateX(0)'
        nodeIsSwiping.value = false
      }
    }
  },
})
</script>
