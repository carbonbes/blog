<template>
  <Dropdown
    :items="nodeActions"
    :side-offset="5"
    @isOpen="onOpen"
    ref="dropdownRef"
  >
    <UIButton
      size="s"
      variant="secondary"
      :class="{ '!bg-gray-200 !ring-gray-200 !opacity-100': isOpen }"
      draggable
      data-drag-handle
    >
      <ITablerGripVertical class="!size-4 pointer-events-none" />
    </UIButton>
  </Dropdown>
</template>

<script lang="ts" setup>
import type Dropdown from '~/components/global/dropdown/Dropdown.vue'
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

const props = defineProps<{
  pos: number
  nodeAttrs: any
}>()

const emit = defineEmits<{
  onOpen: [boolean]
}>()

const {
  selectedNodeType,
  selectedNodeNeighbors,
  setNodeSelection,
  toggleNodeAttribute,
  moveNode,
  removeNode,
  changeNodeType,
} = useEditor()

const dropdownRef = ref<InstanceType<typeof Dropdown>>()

const isOpen = ref(false)

function onOpen(value: boolean) {
  emit('onOpen', value)
  isOpen.value = value
}

function close() {
  dropdownRef.value?.setOpen(false)
  emit('onOpen', false)
}

const nodeActions = computed(() => [
  {
    icon: Pin,
    label: 'Вывести в карточке',
    action: () => {
      setNodeSelection(props.pos)
      toggleNodeAttribute('pin')
    },
    active: props.nodeAttrs.pin,
  },
  {
    icon: EyeOff,
    label: 'Скрыть',
    action: () => {
      setNodeSelection(props.pos)
      toggleNodeAttribute('spoiler')
    },
    active: props.nodeAttrs.spoiler,
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
        action: () => changeNodeType({ type: 'heading', level: 2 }),
        subitems: [
          {
            icon: Heading1,
            label: '1 уровня',
            action: () => changeNodeType({ type: 'heading', level: 1 }),
            hide: props.nodeAttrs.level === 1,
          },
          {
            icon: Heading2,
            label: '2 уровня',
            action: () => changeNodeType({ type: 'heading', level: 2 }),
            hide: props.nodeAttrs.level === 2,
          },
        ],
      },
      {
        icon: Paragraph,
        label: 'Текст',
        action: () => changeNodeType({ type: 'paragraph' }),
        hide: selectedNodeType.value === 'paragraph',
      },
      {
        icon: List,
        label: 'Список',
        action: () => changeNodeType({ type: 'bulletList' }),
        subitems: [
          {
            icon: List,
            label: 'Маркированный',
            action: () => changeNodeType({ type: 'bulletList' }),
            hide: selectedNodeType.value === 'bulletList',
          },
          {
            icon: ListNumbers,
            label: 'Нумерованный',
            action: () => changeNodeType({ type: 'orderedList' }),
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
    action: () => {
      removeNode()
      close()
    },
  },
])
</script>
