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

const emit = defineEmits<{
  onOpen: [boolean]
  changeNodeType: [{ type: NodeType, level?: HeadingLevel }]
  toggleAttribute: [attr: 'pin' | 'spoiler']
  removeNode: [void]
}>()

const {
  selectedNodeType,
  selectedNodeAttrs,
  selectedNodeNeighbors,
  moveNode
} = useEditor()

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
    active: selectedNodeAttrs.value?.pin,
    // disabled: !props.nodeIsPinned && props.editor.extensionStorage.rootNode.pinned === 2
  },
  {
    icon: EyeOff,
    label: 'Скрыть',
    action: () => emit('toggleAttribute', 'spoiler'),
    active: selectedNodeAttrs.value?.spoiler,
  },
  {
    separator: true,
  },
  {
    icon: ArrowUp,
    label: 'Вверх',
    action: () => moveNode('up'),
    disabled: !selectedNodeNeighbors.value?.prevNode
  },
  {
    icon: ArrowDown,
    label: 'Вниз',
    action: () => moveNode('down'),
    disabled: !selectedNodeNeighbors.value?.nextNode
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
        hide: ['bulletList', 'orderedList'].includes(selectedNodeType.value),
        action: () => emit('changeNodeType', { type: 'heading', level: 2 }),
        subitems: [
          {
            icon: Heading1,
            label: '1 уровня',
            action: () => emit('changeNodeType', { type: 'heading', level: 1 }),
            hide: selectedNodeAttrs.value?.level === 1,
          },
          {
            icon: Heading2,
            label: '2 уровня',
            action: () => emit('changeNodeType', { type: 'heading', level: 2 }),
            hide: selectedNodeAttrs.value?.level === 2,
          },
        ],
      },
      {
        icon: Paragraph,
        label: 'Текст',
        action: () => emit('changeNodeType', { type: 'paragraph' }),
        hide: selectedNodeType.value === 'paragraph',
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
            hide: selectedNodeType.value === 'bulletList',
          },
          {
            icon: ListNumbers,
            label: 'Нумерованный',
            action: () => emit('changeNodeType', { type: 'orderedList' }),
            hide: selectedNodeType.value === 'orderedList',
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
