<template>
  <NodeViewWrapper :class="nodeClasses" data-type="root-node">
    <Flex
      class="pt-1.5 sm:items-center gap-1 self-start hidden sm:flex sm:[&>button]:opacity-0 sm:group-hover/node:[&>button]:opacity-100 [&>button]:transition-opacity"
      contentEditable="false"
    >
      <NodesListDropdown @isOpen="onOpen" />
      <NodeActionsDropdown :pos="getPos()" :nodeAttrs="selectedNodeAttrs" @onOpen="onOpen" />
    </Flex>

    <Flex
      class="relative w-full touch-pan-y"
      :class="{ 'transition-transform': !isSwiping }"
      :style="nodeContentStyles"
      ref="nodeContentRef"
    >
      <Flex
        itemsCenter
        justifyEnd
        class="absolute right-full mr-4 pr-4 w-full h-full bg-green-500 gap-2 sm:hidden rounded-r-xl text-base font-medium text-white"
      >
        <ITablerPlus />
        Новый узел
      </Flex>

      <NodeViewContent :class="nodeViewContentClasses" />

      <Flex
        itemsCenter
        class="absolute top-1/2 left-full -translate-y-1/2 ml-4 pl-4 py-4 w-full h-full bg-blue-500 gap-2 sm:hidden rounded-l-xl text-base font-medium text-white"
      >
        Настройки узла
        <ITablerGripVertical />
      </Flex>

      <Flex col class="absolute top-0 right-0 gap-2 sm:hidden">
        <UIButton
          v-if="node.attrs?.pin"
          size="s"
          variant="secondary"
        >
          <ITablerPin
            class="!size-4"
            :class="{ 'text-blue-700': node.attrs?.pin }"
          />
        </UIButton>

        <UIButton
          v-if="node.attrs?.spoiler"
          size="s"
          variant="secondary"
        >
          <ITablerEyeOff
            class="!size-4"
            :class="{ 'text-blue-700': node.attrs?.spoiler }"
          />
        </UIButton>
      </Flex>
    </Flex>

    <Flex
      class="pt-1.5 sm:items-center gap-1 self-start hidden sm:flex sm:[&>button]:opacity-0 sm:group-hover/node:[&>button]:opacity-100 [&>button]:transition-opacity"
      contentEditable="false"
    >
      <UIButton
        size="s"
        variant="secondary"
        :class="{ '!opacity-100': node.attrs?.pin }"
        @click="selectNode(); toggleNodeAttribute('pin')"
      >
        <ITablerPin class="!size-4" :class="{ 'text-blue-700': node.attrs?.pin }" />
      </UIButton>

      <UIButton
        size="s"
        variant="secondary"
        :class="{ '!opacity-100': node.attrs?.spoiler }"
        @click="selectNode(); toggleNodeAttribute('spoiler')"
      >
        <ITablerEyeOff
          class="!size-4"
          :class="{ 'text-blue-700': node.attrs?.spoiler }"
        />
      </UIButton>
    </Flex>

    <NodesListBottomsheet
      @onOpen="onOpen"
      ref="nodesListBSRef"
    />

    <NodeActionsBottomsheet
      @onOpen="onOpen"
      ref="nodeActionsBSRef"
    />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/vue-3'
import NodesListDropdown from '~/components/editor/nodes/root-node/NodesListDropdown.vue'
import NodeActionsDropdown from '~/components/editor/nodes/root-node/NodeActionsDropdown.vue'
import NodesListBottomsheet from '~/components/editor/nodes/root-node/NodesListBottomsheet.vue'
import NodeActionsBottomsheet from '~/components/editor/nodes/root-node/NodeActionsBottomsheet.vue'
import type Flex from '~/components/global/Flex.vue'

const props = defineProps<NodeViewProps>()

const {
  selectionIsEmpty,
  setNodeSelection,
  toggleNodeAttribute,
  selectedNodeAttrs
} = useEditor()

const nodeType = computed<string>(() => props.node.content.content[0].type.name)

const nodeHeadingClasses = computed(() => {
  const nodeContent = props.node.content.content[0]
  const level = nodeContent.attrs.level

  if (nodeContent.type.name !== 'heading') return {}

  return {
    ['heading-' + level]: true,
    'not-first:!mt-8 not-first:!sm:mt-4': true,
    ...(level === 1 ? {
      'text-2xl': true,
      'font-bold': true
    } : {}),
    ...(level === 2 ? {
      'text-xl': true,
      'font-bold': true
    } : {}),
  }
})

const nodeParagraphClasses = computed(() => {
  if (nodeType.value !== 'paragraph') return {}

  return {}
})

const nodeListsClasses = computed(() => {
  if (!['orderedList', 'bulletList'].includes(nodeType.value)) return {}

  return {}
})

const nodeGalleryClasses = computed(() => {
  if (nodeType.value !== 'gallery') return {}

  return {}
})

const nodeSNEmbedClasses = computed(() => {
  if (nodeType.value !== 'sn-embed') return {}

  return {}
})

const nodeSeparatorClasses = computed(() => {
  if (nodeType.value !== 'horizontalRule') return {}

  return {}
})

const nodeClasses = computed(() => ({
  'not-first:mt-4 not-last:mb-4 not-first:sm:mt-2 not-last:sm:mb-2 relative flex gap-4 group/node': true,
  [nodeType.value]: true,
  ...nodeHeadingClasses.value,
  ...nodeParagraphClasses.value,
  ...nodeListsClasses.value,
  ...nodeGalleryClasses.value,
  ...nodeSNEmbedClasses.value,
  ...nodeSeparatorClasses.value
}))

const nodeViewListsClasses = computed(() => {
  if (!['orderedList', 'bulletList'].includes(nodeType.value)) return {}

  return {
    '[&_ol]:pl-4': true,
    '[&_ul]:pl-4': true,
    'not-first:[&_ul_>_li]:mt-2': true,
    'not-first:[&_ol_>_li]:mt-2': true,
    '[&_ol]:list-decimal': true,
    '[&_ul]:list-disc': true
  }
})

const nodeViewSeparatorClasses = computed(() => {
  if (nodeType.value !== 'horizontalRule') return {}

  return {
    '[&_hr]:h-full': true,
    '[&_hr]:border-transparent': true,
    '[&_hr]:after:content-["*_*_*"]': true,
    '[&_hr]:after:w-full': true,
    '[&_hr]:after:inline-block': true,
    '[&_hr]:after:text-2xl': true,
    '[&_hr]:after:text-center': true,
    '[&_hr]:after:align-middle': true,
  }
})

const nodeIsSelected = ref(false)

const nodeViewContentClasses = computed(() => ({
  'sm:py-2 sm:px-3 rounded-xl w-full outline-none transition-colors duration-300': true,
  '!bg-blue-100/50': nodeIsSelected.value,
  ...nodeViewListsClasses.value,
  ...nodeViewSeparatorClasses.value
}))

const nodeContentRef = ref<InstanceType<typeof Flex>>()
const nodesListBSRef = ref<InstanceType<typeof NodesListBottomsheet>>()
const nodeActionsBSRef = ref<InstanceType<typeof NodesListBottomsheet>>()

function selectNode() {
  setNodeSelection(props.getPos())
}

function onOpen(value: boolean) {
  nodeIsSelected.value = value

  if (value) {
    selectNode()
  } else {
    resetTranslateX()
  }
}

const translateX = ref(0)

function resetTranslateX() {
  translateX.value = 0
}

const nodeContentStyles = computed(() => `transform: translateX(${translateX.value}px)`)

const { swipeEnabled } = useRootNode()
const isSwiping = ref(false)

useGesture(nodeContentRef,
  {
    onDrag(state) {
      if (!selectionIsEmpty.value || !swipeEnabled.value) return

      const { movement: [x] } = state

      isSwiping.value = true
      translateX.value = x
    },

    onDragEnd(state) {
      if (!selectionIsEmpty.value || !swipeEnabled.value) return

      const { movement: [x], direction: [xDir] } = state

      const { clientWidth: nodeContentElWidth } = nodeContentRef.value?.$el as HTMLElement

      isSwiping.value = false

      const dir = xDir > 0 ? 'right' : xDir < 0 ? 'left' : undefined

      if (dir === 'right') {
        if (x > 0 && Math.abs(x) / nodeContentElWidth >= 0.25) {
          resetTranslateX()
          nodesListBSRef.value?.setOpen(true)
        } else {
          resetTranslateX()
        }
      } else if (dir === 'left') {
        if (x < 0 && Math.abs(x) / nodeContentElWidth >= 0.25) {
          resetTranslateX()
          nodeActionsBSRef.value?.setOpen(true)
        } else {
          resetTranslateX()
        }
      }
    },
  },
  {
    drag: {
      axis: 'x',
      bounds: { left: -150, right: 150 },
      rubberband: true,
      from: [0, 0],
    },
    onlyTouchDevices: true
  }
)
</script>
