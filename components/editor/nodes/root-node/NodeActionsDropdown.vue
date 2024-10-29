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
import type Dropdown from '~/components/global/dropdown/Dropdown.client.vue'
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
import type { NodeAttrs } from '~/types'

const props = defineProps<{
  pos: number
  nodeAttrs: NodeAttrs
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
    group: [
      {
        icon: Pin,
        label: 'Вывести в карточке',
        active: props.nodeAttrs.pin,
        action: () => {
          setNodeSelection(props.pos)
          toggleNodeAttribute('pin')
          close()
        },
      },
      {
        icon: EyeOff,
        label: 'Скрыть',
        active: props.nodeAttrs.spoiler,
        action: () => {
          setNodeSelection(props.pos)
          toggleNodeAttribute('spoiler')
          close()
        },
      },
    ],
  },
  {
    group: [
      {
        icon: ArrowUp,
        label: 'Вверх',
        disabled: !selectedNodeNeighbors.value?.prevNode,
        action: () => {
          moveNode('up')
          close()
        },
      },
      {
        icon: ArrowDown,
        label: 'Вниз',
        disabled: !selectedNodeNeighbors.value?.nextNode,
        action: () => {
          moveNode('down')
          close()
        },
      },
    ],
  },
  {
    group: [
      {
        icon: Refresh,
        label: 'Поменять на',
        disabled: ['sn-embed', 'gallery', 'link', 'separator'].includes(
          selectedNodeType.value
        ),
        subitems: [
          {
            icon: Heading,
            label: 'Заголовок',
            action: () => {
              changeNodeType({ type: 'heading', attrs: { level: 2 } })
              close()
            },
            subitems: [
              {
                icon: Heading1,
                label: '1 уровня',
                hide: selectedNodeType.value === 'heading' && props.nodeAttrs.level === 1,
                action: () => {
                  changeNodeType({ type: 'heading', attrs: { level: 1 } })
                  close()
                },
              },
              {
                icon: Heading2,
                label: '2 уровня',
                hide: selectedNodeType.value === 'heading' && props.nodeAttrs.level === 2,
                action: () => {
                  changeNodeType({ type: 'heading', attrs: { level: 2 } })
                  close()
                },
              },
            ],
          },
          {
            icon: Paragraph,
            label: 'Текст',
            hide: selectedNodeType.value === 'paragraph',
            action: () => {
              changeNodeType({ type: 'paragraph' })
              close()
            },
          },
          {
            icon: List,
            label: 'Список',
            action: () => {
              changeNodeType({ type: 'bulletList' })
              close()
            },
            subitems: [
              {
                icon: List,
                label: 'Маркированный',
                hide: selectedNodeType.value === 'bulletList',
                action: () => {
                  changeNodeType({ type: 'bulletList' })
                  close()
                },
              },
              {
                icon: ListNumbers,
                label: 'Нумерованный',
                hide: selectedNodeType.value === 'orderedList',
                action: () => {
                  changeNodeType({ type: 'orderedList' })
                  close()
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    icon: Trash,
    label: 'Удалить',
    class: 'text-red-500',
    action: () => {
      removeNode()
      close()
    },
  },
])
</script>
