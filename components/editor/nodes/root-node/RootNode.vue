<template>
  <NodeViewWrapper :class="nodeClasses" data-type="root-node">
    <Flex
      class="pt-3 sm:items-center gap-1 self-start hidden sm:flex sm:[&>button]:opacity-0 sm:group-hover/node:[&>button]:opacity-100 [&>button]:transition-opacity"
      contentEditable="false"
    >
      <UIButton size="s" variant="secondary">
        <ITablerPlus class="!size-4" />
      </UIButton>

      <NodeActionsButton
        :editor
        :nodeIsPinned
        :nodeIsSpoilered
        :nodeType
        :nodeAttrs
        :neighborNodes
        @onOpen="onOpen"
        @changeNodeType="changeNodeType"
        @toggleAttribute="toggleAttribute"
        @moveNode="moveNode"
        @removeNode="deleteNode"
      />
    </Flex>

    <Flex
      class="relative w-full"
      :class="{ 'transition-transform': !isSwiping }"
      :style="{ transform: transformX }"
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

      <NodeViewContent
        class="sm:py-2 sm:px-3 rounded-xl w-full [&_ol]:pl-4 [&_ul]:pl-4 not-first:[&_ul_>_li]:mt-2 not-first:[&_ol_>_li]:mt-2 [&_ol]:list-decimal [&_ul]:list-disc outline-none transition-colors"
        :class="{ 'bg-blue-100/50': nodeSelected }"
      />

      <Flex
        itemsCenter
        class="absolute top-1/2 left-full -translate-y-1/2 ml-4 pl-4 py-4 w-full h-full bg-gray-100 gap-2 sm:hidden rounded-l-xl"
      />

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

    <Flex
      class="pt-3 sm:items-center gap-1 self-start hidden sm:flex sm:[&>button]:opacity-0 sm:group-hover/node:[&>button]:opacity-100 [&>button]:transition-opacity"
      contentEditable="false"
    >
      <UIButton
        size="s"
        variant="secondary"
        :class="{ '!opacity-100': nodeIsPinned }"
        @click="toggleAttribute('pin')"
      >
        <ITablerPin class="!size-4" :class="{ 'text-blue-700': nodeIsPinned }" />
      </UIButton>

      <UIButton
        size="s"
        variant="secondary"
        :class="{ '!opacity-100': nodeIsSpoilered }"
        @click="toggleAttribute('spoiler')"
      >
        <ITablerEyeOff class="!size-4" :class="{ 'text-blue-700': nodeIsSpoilered }" />
      </UIButton>
    </Flex>

    <NodesListBottomsheet @insertNode="insertNode" ref="nodesListBSRef" />

    <NodeActionsBottomsheet
      :nodeIsPinned
      :nodeIsSpoilered
      :nodeType
      :neighborNodes
      @onOpen="onOpen"
      @close="onClose"
      @moveNode="moveNode"
      @changeNodeType="changeNodeType"
      @toggleAttribute="toggleAttribute"
      @removeNode="deleteNode"
      ref="nodeActionsBSRef"
    />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, NodeViewContent, type NodeViewProps, type JSONContent } from '@tiptap/vue-3'
import { NodeSelection } from '@tiptap/pm/state'
import NodeActionsButton from '~/components/editor/nodes/root-node/NodeActionsButton.vue'
import NodesListBottomsheet from '~/components/editor/nodes/root-node/NodesListBottomsheet.vue'
import NodeActionsBottomsheet from '~/components/editor/nodes/root-node/NodeActionsBottomsheet.vue'
import type { HeadingLevel, NodeType } from '~/types'

const props = defineProps<NodeViewProps>()

const nodeSelected = ref(false)

const nodePos = computed(() => {
  if (!props.selected) return null

  const { selection } = props.editor.state
  
  return {
    from: (selection as NodeSelection).from,
    to: (selection as NodeSelection).to
  }
})

const nodeType = computed(() => props.node.content.content[0].type.name as NodeType)
const nodeAttrs = computed(() => props.node.content.content[0].attrs)
const nodeIsPinned = computed<boolean>(() => props.node.attrs.pin)
const nodeIsSpoilered = computed<boolean>(() => props.node.attrs.spoiler)

const neighborNodes = computed(() => {
  if (!props.selected) return null

  const { doc } = props.editor.state

  const startPos = nodePos.value?.from!
  const endPos = nodePos.value?.to!

  let prevNode = null
  let nextNode = null

  if (startPos > 0) prevNode = doc.resolve(startPos).nodeBefore
  if (endPos < doc.content.size) nextNode = doc.resolve(endPos).nodeAfter

  return { prevNode, nextNode }
})

const { selectionIsEmpty } = useEditor()

const nodeClasses = computed(() => ({
  'relative flex gap-4 [&.heading-1]:text-2xl [&.heading-1]:font-bold [&.heading-2]:text-xl [&.heading-2]:font-bold not-first:[&.paragraph]:mt-6 not-first:[&.orderedList]:mt-6 not-first:[&.bulletList]:mt-6 not-first:[&.heading]:mt-8 not-first:[&.gallery]:mt-2 sm:not-first:[&.paragraph]:mt-2 sm:not-first:[&.orderedList]:mt-2 sm:not-first:[&.bulletList]:mt-2 sm:not-first:[&.heading]:mt-4 not-first:[&.sn-embed]:mt-4 sm:not-first:[&.sn-embed]:mt-2 group/node': true,
  [props.node.content.content[0].type.name]: true,
  ['heading-' + props.node.content.content[0].attrs.level]: props.node.content.content[0].type.name === 'heading',
}))

const nodeContentRef = ref<HTMLDivElement>()
const nodesListBSRef = ref<InstanceType<typeof NodesListBottomsheet>>()
const nodeActionsBSRef = ref<InstanceType<typeof NodesListBottomsheet>>()

function insertNode(type: NodeType, level?: HeadingLevel) {
  let content: JSONContent[] | undefined

  if (['bulletList', 'orderedList'].includes(type)) {
    content = [{ type: 'listItem', content: [{ type: 'paragraph', content: [] }] }]
  }

  props.editor.chain().insertContentAt(nodePos.value!.to, { type, attrs: { level }, content }).focus().run()

  nodesListBSRef.value?.setOpen(false)
}

function changeNodeType({
  type,
  level = 2,
}: {
  type: NodeType
  level?: HeadingLevel
}) {
  if (type === 'heading')
    props.editor.chain().focus(nodePos.value!.from + 3).toggleHeading({ level }).run()
  
  else if (type === 'paragraph') {
    props.editor.commands.focus(nodePos.value!.from + 3)

    if (props.editor.isActive('bulletList') || props.editor.isActive('orderedList')) {
      const { state } = props.editor
      const { doc } = state
      const resolvedPos = doc.resolve(nodePos.value!.from + 1)

      resolvedPos.nodeAfter?.descendants((node) => {
        if (node.type.name === 'listItem') {
          props.editor.chain().focus().liftListItem('listItem').run()
        }

        return false
      })
    } else {
      props.editor.chain().focus(nodePos.value!.from + 3).setParagraph().run()
    }
  }

  else if (type === 'bulletList')
    props.editor.chain().focus(nodePos.value!.from + 3).toggleBulletList().run()

  else if (type === 'orderedList')
    props.editor.chain().focus(nodePos.value!.from + 3).toggleOrderedList().run()

  props.editor.commands.blur()
}

function moveNode(direction: 'up' | 'down') {
  const { view } = props.editor
  let tr = props.editor.state.tr

  const currentNodeSize = props.node.nodeSize

  if (direction === 'up') {
    const previousNodeStartPos = nodePos.value!.from - neighborNodes.value!.prevNode!.nodeSize
    const previousNodeEndPos = nodePos.value!.from
    const previousNodeSize = neighborNodes.value!.prevNode!.nodeSize

    tr = tr
      .delete(previousNodeStartPos, previousNodeEndPos)
      .insert(nodePos.value!.from - previousNodeSize + currentNodeSize, neighborNodes.value?.prevNode!)
      .scrollIntoView()

    view.dispatch(tr)
  } else {
    const nextNodeStartPos = nodePos.value!.to
    const nextNodeEndPos = nodePos.value!.to + neighborNodes.value!.nextNode!.nodeSize
    const nextNodeSize = neighborNodes.value!.nextNode!.nodeSize

    tr = tr
      .delete(nextNodeStartPos, nextNodeEndPos)
      .insert(nodePos.value!.from - nextNodeSize + currentNodeSize, neighborNodes.value?.nextNode!)
      .scrollIntoView()

    view.dispatch(tr)
  }
}

function toggleAttribute(attr: 'pin' | 'spoiler') {
  const value = props.node.attrs[attr]
  props.updateAttributes({ [attr]: !value })
}

function onOpen(value: boolean) {
  value && props.editor.commands.setNodeSelection(props.getPos())
  nodeSelected.value = value
}

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
        resetTransformX()
        nodeActionsBSRef.value?.setOpen(true)
      } else {
        resetTransformX()
      }
    }
  },
})
</script>
