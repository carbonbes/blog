<template>
  <NodeViewWrapper :class="nodeClasses" data-type="root-node">
    <Flex
      class="pt-1.5 sm:items-center gap-1 self-start hidden sm:flex sm:[&>button]:opacity-0 sm:group-hover/node:[&>button]:opacity-100 [&>button]:transition-opacity"
      contentEditable="false"
    >
      <NodesListDropdown @isOpen="onOpen" />
      <NodeActionsButton :pos="getPos()" :nodeAttrs="node.attrs" @onOpen="onOpen" />
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
        class="absolute right-full mr-4 pr-4 w-full h-full bg-blue-500 gap-2 sm:hidden rounded-r-xl text-base font-normal text-white"
      >
        <ITablerPlus />
        Новый узел
      </Flex>

      <NodeViewContent :class="nodeViewContentClasses" />

      <Flex
        itemsCenter
        class="absolute top-1/2 left-full -translate-y-1/2 ml-4 pl-4 py-4 w-full h-full bg-gray-100 gap-2 sm:hidden rounded-l-xl"
      />

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
import NodeActionsButton from '~/components/editor/nodes/root-node/NodeActionsButton.vue'
import NodesListBottomsheet from '~/components/editor/nodes/root-node/NodesListBottomsheet.vue'
import NodeActionsBottomsheet from '~/components/editor/nodes/root-node/NodeActionsBottomsheet.vue'
import type Flex from '~/components/global/Flex.vue'

const props = defineProps<NodeViewProps>()

const {
  selectionIsEmpty,
  setNodeSelection,
  toggleNodeAttribute
} = useEditor()

const nodeIsSelected = ref(false)
const isSwiping = ref(false)

const nodeHeadingClasses = computed(() => [
  ['heading-' + props.node.content.content[0].attrs.level]: props.node.content.content[0].type.name === 'heading',
  '[&.heading-1]:text-2xl',
  '[&.heading-1]:font-bold',
  '[&.heading-2]:text-xl',
  '[&.heading-2]:font-bold',
  'not-first:[&.heading]:mt-8',
  'sm:not-first:[&.heading]:mt-4'
])

const nodeParagraphClasses = [
  'not-first:[&.paragraph]:mt-6',
  'sm:not-first:[&.paragraph]:mt-2'
]

const nodeListsClasses = [
  'not-first:[&.orderedList]:mt-6',
  'not-first:[&.bulletList]:mt-6',
  'sm:not-first:[&.orderedList]:mt-2',
  'sm:not-first:[&.bulletList]:mt-2'
]

const nodeGalleryClasses = ['not-first:[&.gallery]:mt-4']

const nodeSNEmbedClasses = [
  'not-first:[&.sn-embed]:mt-4',
  'sm:not-first:[&.sn-embed]:mt-2'
]

const nodeClasses = computed(() => ({
  'relative flex gap-4 group/node': true,
  [props.node.content.content[0].type.name]: true,
  [nodeHeadingClasses.value]: true
}))

const nodeViewListsClasses = [
  '[&_ol]:pl-4',
  '[&_ul]:pl-4',
  'not-first:[&_ul_>_li]:mt-2',
  'not-first:[&_ol_>_li]:mt-2',
  '[&_ol]:list-decimal',
  '[&_ul]:list-disc'
].join(' ')

const nodeViewHrClasses = [
  '[&_hr]:border-transparent',
  '[&_hr]:w-full',
  '[&_hr]:h-full',
  '[&_hr]:text-2xl',
  '[&_hr]:after:content-["*_*_*"]',
  '[&_hr]:after:flex',
  '[&_hr]:after:justify-center'
].join(' ')

const nodeViewContentClasses = computed(() => ({
  'sm:py-2 sm:px-3 rounded-xl w-full outline-none transition-colors duration-300': true,
  '!bg-blue-100/50': nodeIsSelected.value,
  nodeViewListsClasses,
  nodeViewHrClasses
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
