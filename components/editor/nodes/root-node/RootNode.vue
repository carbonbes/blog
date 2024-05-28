<template>
  <NodeViewWrapper :class="nodeClasses" data-type="root-node">
    <Flex :class="nodeDesktopLeftControlsClasses" contentEditable="false">
      <UIButton size="s" variant="secondary">
        <ITablerPlus class="!size-4" />
      </UIButton>

      <UIButton
        size="s"
        variant="secondary"
        draggable
        data-drag-handle>
        <ITablerGripVertical class="!size-4" />
      </UIButton>
    </Flex>

    <Flex
      :class="nodeContentWrapperClasses"
      :style="{ transform: transformX }"
      ref="nodeContentRef"
    >
      <Flex
        itemsCenter
        justifyEnd
        class="absolute right-full pr-4 w-full h-full bg-gray-100 gap-2 sm:hidden text-base font-normal"
      >
        <ITablerPlus />
        Новый блок
      </Flex>

      <NodeViewContent :class="nodeContentClasses" />

      <Flex
        itemsCenter
        class="absolute left-full pl-4 w-full h-full bg-gray-100 gap-2 sm:hidden"
      >
        <UIButton
          v-for="(button, i) in nodeQuickActions"
          :key="i"
          variant="secondary"
          size="s"
          class="shadow"
          @click="button.action"
        >
          <Component :is="button.icon" />
        </UIButton>
      </Flex>

      <Flex col class="absolute top-0 right-0 gap-2 sm:hidden">
        <UIButton
          v-if="nodeIsPinned"
          size="s"
          variant="secondary"
        >
          <ITablerPin class="!size-4" :class="{ 'text-blue-700': nodeIsPinned }" />
        </UIButton>

        <UIButton
          v-if="nodeIsSpoilered"
          size="s"
          variant="secondary"
        >
          <ITablerEyeOff class="!size-4" :class="{ 'text-blue-700': nodeIsSpoilered }" />
        </UIButton>
      </Flex>
    </Flex>

    <Flex :class="nodeDesktopRightControlsClasses" contentEditable="false">
      <UIButton
        size="s"
        variant="secondary"
        :class="{ '!opacity-100': nodeIsPinned }"
      >
        <ITablerPin class="!size-4" :class="{ 'text-blue-700': nodeIsPinned }" />
      </UIButton>

      <UIButton
        size="s"
        variant="secondary"
        :class="{ '!opacity-100': nodeIsSpoilered }"
      >
        <ITablerEyeOff class="!size-4" :class="{ 'text-blue-700': nodeIsSpoilered }" />
      </UIButton>
    </Flex>

    <NodesListBottomsheet ref="nodesListBSRef" />

    <NodeActionsBottomsheet
      :update-attributes="updateAttributes"
      :nodeIsPinned
      :nodeIsSpoilered
      :nodeType
      @close="onClose"
      ref="nodeActionsBSRef"
    />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/vue-3'
import NodesListBottomsheet from '~/components/editor/nodes/root-node/NodesListBottomsheet.vue'
import NodeActionsBottomsheet from '~/components/editor/nodes/root-node/NodeActionsBottomsheet.vue'
import ArrowUp from '~icons/tabler/arrow-up'
import ArrowDown from '~icons/tabler/arrow-down'
import Trash from '~icons/tabler/trash'
import Dots from '~icons/tabler/dots'
import X from '~icons/tabler/x'

const props = defineProps<NodeViewProps>()

const nodeType = computed(() => props.node.type.name)
const nodeIsPinned = computed<boolean>(() => props.node.attrs.pin)
const nodeIsSpoilered = computed<boolean>(() => props.node.attrs.spoiler)

const { selectionIsEmpty } = useEditor()

const nodeClasses = computed(() => ({
  'relative flex gap-4 [&.heading-1]:text-2xl [&.heading-1]:font-bold [&.heading-2]:text-xl [&.heading-2]:font-bold not-first:[&.paragraph]:mt-4 not-first:[&.orderedList]:mt-4 not-first:[&.bulletList]:mt-4 not-first:[&.heading]:mt-6 group/node': true,
  [props.node.content.content[0].type.name]: true,
  ['heading-' + props.node.content.content[0].attrs.level]: props.node.content.content[0].type.name === 'heading',
}))

const nodeDesktopLeftControlsClasses = computed(() => ({
  'sm:items-center gap-1 self-start hidden sm:flex sm:[&>button]:opacity-0 sm:group-hover/node:[&>button]:opacity-100 [&>button]:transition-opacity': true,
}))

const nodeContentWrapperClasses = computed(() => ({
  'relative w-full': true,
  'transition-transform': !isSwiping.value
}))

const nodeContentClasses = computed(() => ({
  'w-full [&_ol]:pl-4 [&_ul]:pl-4 [&_ol]:list-decimal [&_ul]:list-disc outline-none': true,
}))

const nodeDesktopRightControlsClasses = computed(() => ({
  'sm:items-center gap-1 self-start hidden sm:flex sm:[&>button]:opacity-0 sm:group-hover/node:[&>button]:opacity-100 [&>button]:transition-opacity': true,
}))

const nodeContentRef = ref<HTMLDivElement>()
const nodesListBSRef = ref<InstanceType<typeof NodesListBottomsheet>>()
const nodeActionsBSRef = ref<InstanceType<typeof NodesListBottomsheet>>()

const nodeQuickActions = markRaw([
  {
    icon: ArrowUp
  },
  {
    icon: ArrowDown
  },
  {
    icon: Trash,
    action: () => {
      props.deleteNode()
      props.editor.commands.blur()
    }
  },
  {
    icon: Dots,
    action: () => {
      nodeActionsBSRef.value?.setOpen(true)
      props.editor.commands.blur()
    }
  },
  {
    icon: X,
    action: () => {
      resetTransformX()
      props.editor.commands.blur()
    }
  }
])

function onClose() {
  props.editor.commands.blur()
  resetTransformX()
}

const transformX = ref('0')

function resetTransformX() {
  transformX.value = 'translateX(0)'
}

const { scrollIsLocked } = useEditorDialog()

const { isSwiping, direction, lengthX } = useSwipe(nodeContentRef, {
  onSwipe() {
    if (!selectionIsEmpty.value) return

    if (['left', 'right'].includes(direction.value)) {
      scrollIsLocked.value = true
    }

    if (direction.value === 'right') {
      if (lengthX.value < 0) {
        const value = Math.abs(lengthX.value)
        transformX.value = `translateX(${value}px)`
      } else {
        resetTransformX()
      }
    } else {
      if (lengthX.value > 0) {
        const value = Math.abs(lengthX.value)
        transformX.value = `translateX(-${value}px)`
      } else {
        resetTransformX()
      }
    }
  },

  onSwipeEnd() {
    if (!selectionIsEmpty.value) return

    scrollIsLocked.value = false

    const el = nodeContentRef.value?.$el as HTMLElement

    if (direction.value === 'right') {
      if (lengthX.value < 0 && el.clientWidth && (Math.abs(lengthX.value) / el.clientWidth) >= 0.25) {
        resetTransformX()
        nodesListBSRef.value?.setOpen(true)
      } else {
        resetTransformX()
      }
    } else {
      if (lengthX.value > 0 && el.clientWidth && (Math.abs(lengthX.value) / el.clientWidth) >= 0.25) {
        transformX.value = 'translateX(-75%)'
      } else {
        resetTransformX()
      }
    }
  },
})
</script>
