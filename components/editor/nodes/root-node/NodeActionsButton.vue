<template>
  <Dropdown :items="nodeActions" :side-offset="5" @isOpen="onOpen" ref="dropdownRef">
    <UIButton
      size="s"
      variant="secondary"
      :class="{ '!bg-gray-200 !ring-gray-200 !opacity-100': isOpen }"
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
import type { HeadingLevel, NodeAttrs, NodeType } from '~/types'
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
import type { Node } from '@tiptap/pm/model'

const props = defineProps<{
  editor: Editor
  nodeIsPinned: boolean
  nodeIsSpoilered: boolean
  nodeType: NodeType
  nodeAttrs: NodeAttrs
  neighborNodes: { prevNode: Node | null, nextNode: Node | null } | null
}>()

const emit = defineEmits<{
  onOpen: [boolean]
  changeNodeType: [{ type: NodeType, level?: HeadingLevel }]
  toggleAttribute: [attr: 'pin' | 'spoiler']
  moveNode: [dir: 'up' | 'down']
  removeNode: [void]
}>()

const dropdownRef = ref<InstanceType<typeof Dropdown>>()

const isOpen = ref(false)

function onOpen(value: boolean) {
  emit('onOpen', value)
  isOpen.value = value
}

function removeNode() {
  emit('removeNode')

  dropdownRef.value?.setOpen(false)
  emit('onOpen', false)
}

const nodeActions = computed(() => [
  {
    icon: Pin,
    label: 'Вывести в карточке',
    action: () => emit('toggleAttribute', 'pin'),
    active: props.nodeIsPinned,
    // disabled: !props.nodeIsPinned && props.editor.extensionStorage.rootNode.pinned === 2
  },
  {
    icon: EyeOff,
    label: 'Скрыть',
    action: () => emit('toggleAttribute', 'spoiler'),
    active: props.nodeIsSpoilered,
  },
  {
    separator: true,
  },
  {
    icon: ArrowUp,
    label: 'Вверх',
    action: () => emit('moveNode', 'up'),
    disabled: !props.neighborNodes?.prevNode
  },
  {
    icon: ArrowDown,
    label: 'Вниз',
    action: () => emit('moveNode', 'down'),
    disabled: !props.neighborNodes?.nextNode
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
        hide: ['bulletList', 'orderedList'].includes(props.nodeType),
        action: () => emit('changeNodeType', { type: 'heading', level: 2 }),
        subitems: [
          {
            icon: Heading1,
            label: '1 уровня',
            action: () => emit('changeNodeType', { type: 'heading', level: 1 }),
            hide: props.nodeAttrs.level === 1,
          },
          {
            icon: Heading2,
            label: '2 уровня',
            action: () => emit('changeNodeType', { type: 'heading', level: 2 }),
            hide: props.nodeAttrs.level === 2,
          },
        ],
      },
      {
        icon: Paragraph,
        label: 'Текст',
        action: () => emit('changeNodeType', { type: 'paragraph' }),
        hide: props.nodeType === 'paragraph',
      },
      {
        icon: List,
        label: 'Список',
        action: () => emit('changeNodeType', { type: 'bulletList' }),
        subitems: [
          {
            icon: List,
            label: 'Маркированный',
            action: () => emit('changeNodeType', { type: 'bulletList' }),
            hide: props.nodeType === 'bulletList',
          },
          {
            icon: ListNumbers,
            label: 'Нумерованный',
            action: () => emit('changeNodeType', { type: 'orderedList' }),
            hide: props.nodeType === 'orderedList',
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
