<template>
  <Dropdown :items="nodeActions" :side-offset="5" @isOpen="onOpen" ref="dropdownRef">
    <UIButton
      size="s"
      variant="secondary"
      :class="{ '!bg-gray-100 !opacity-100': isOpen }"
      draggable
      data-drag-handle
    >
      <ITablerGripVertical class="!size-4" />
    </UIButton>
  </Dropdown>
</template>

<script lang="ts" setup>
import type Dropdown from '~/components/global/dropdown/Dropdown.vue'
import type { Editor } from '@tiptap/core'
import type { HeadingLevel, NodeType } from '~/types'
import Paragraph from '~icons/tabler/letter-case'
import Heading from '~icons/tabler/heading'
import List from '~icons/tabler/list'
import Pin from '~icons/tabler/pin'
import EyeOff from '~icons/tabler/eye-off'
import ArrowUp from '~icons/tabler/arrow-up'
import ArrowDown from '~icons/tabler/arrow-down'
import Refresh from '~icons/tabler/refresh'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import ListNumbers from '~icons/tabler/list-numbers'
import Trash from '~icons/tabler/trash'
import type { NodeSelection } from '@tiptap/pm/state'

const props = defineProps<{
  editor: Editor
  nodeIsPinned: boolean
  nodeIsSpoilered: boolean
  nodeType: NodeType
}>()

const emit = defineEmits<{
  isOpen: [boolean]
  changeNodeType: [type: NodeType, level?: HeadingLevel]
  updateAttribute: [attr: 'pin' | 'spoiler', value: boolean]
  removeNode: [void]
}>()

const dropdownRef = ref<InstanceType<typeof Dropdown>>()

const isOpen = ref(false)

function onOpen(value: boolean) {
  emit('isOpen', value)
  isOpen.value = value
}

const previousNode = computed(() => {
  const currentNodeSelected = props.editor.state.selection as NodeSelection | undefined

  if (!currentNodeSelected) return null

  if (currentNodeSelected?.from! - 1 <= 0) return null

  return props.editor.state.doc.resolve(currentNodeSelected?.from! - 1)?.nodeBefore
})

const nextNode = computed(() => {
  const currentNodeSelected = props.editor.state.selection as NodeSelection | undefined

  if (!currentNodeSelected) return null

  if (currentNodeSelected?.to! + 1 >= props.editor.state.doc.nodeSize!) return null

  return props.editor.state.doc.resolve(currentNodeSelected?.to! + 1)?.nodeAfter
})

function moveNode(dir: 'up' | 'down') {
  if (dir === 'up') {
    if (!previousNode.value) return
  } else {
    if (!nextNode.value) return
  }
}

function transformNode({
  type,
  level = 1,
}: {
  type: NodeType
  level?: HeadingLevel
}) {
  emit('changeNodeType', type, level)
}

function toggleAttrubite(attr: string) {
  if (attr === 'pin') emit('updateAttribute', 'pin', !props.nodeIsPinned)
  if (attr === 'spoiler') emit('updateAttribute', 'spoiler', !props.nodeIsSpoilered)
}

function removeNode() {
  emit('removeNode')

  dropdownRef.value?.setOpen(false)
  emit('isOpen', false)
}

const nodeActions = computed(() => [
  {
    icon: Pin,
    label: props.nodeIsPinned ? 'Выводится в карточке' : 'Вывести в карточке',
    action: () => toggleAttrubite('pin'),
    active: props.nodeIsPinned,
    // disabled: !props.nodeIsPinned
  },
  {
    icon: EyeOff,
    label: props.nodeIsSpoilered ? 'Скрывается' : 'Скрыть',
    action: () => toggleAttrubite('spoiler'),
    active: props.nodeIsSpoilered,
  },
  {
    separator: true,
  },
  {
    icon: ArrowUp,
    label: 'Вверх',
    action: () => moveNode('up'),
    disabled: !previousNode.value
  },
  {
    icon: ArrowDown,
    label: 'Вниз',
    action: () => moveNode('down'),
    disabled: !nextNode.value
  },
  {
    separator: true,
  },
  {
    icon: Refresh,
    label: 'Поменять на',
    subitems: [
      {
        icon: Heading,
        label: 'Заголовок',
        // hide: !isTextNode.value,
        action: () => transformNode({ type: 'heading', level: 2 }),
        subitems: [
          {
            icon: Heading1,
            label: '1 уровня',
            action: () => transformNode({ type: 'heading', level: 1 }),
            // hide: props.selectedNode?.attrs.level === 1,
          },
          {
            icon: Heading2,
            label: '2 уровня',
            action: () => transformNode({ type: 'heading', level: 2 }),
            // hide: props.selectedNode?.attrs.level === 2,
          },
        ],
      },
      {
        icon: Paragraph,
        label: 'Текст',
        action: () => transformNode({ type: 'paragraph' }),
        // hide: props.selectedNode?.type.name === 'paragraph',
      },
      {
        icon: List,
        label: 'Список',
        action: () => transformNode({ type: 'bulletList' }),
        subitems: [
          {
            icon: List,
            label: 'Маркированный',
            action: () => transformNode({ type: 'bulletList' }),
            // hide: props.selectedNode?.type.name === 'bulletList',
          },
          {
            icon: ListNumbers,
            label: 'Нумерованный',
            action: () => transformNode({ type: 'orderedList' }),
            // hide: props.selectedNode?.type.name === 'orderedList',
          },
        ],
      },
    ],
  },
  {
    separator: true,
  },
  {
    icon: Trash,
    label: 'Удалить',
    action: removeNode,
  },
])
</script>
