<template>
  <Dropdown :items="nodeActions" :side-offset="5" @is-open="onOpen">
    <button
      class="p-1 rounded-lg hover:bg-gray-100 [&.active]:bg-gray-200 transition-colors"
      :class="{ active: isOpen }"
    >
      <ITablerGripVertical class="!w-5 !h-5" />
    </button>
  </Dropdown>
</template>

<script lang="ts" setup>
import type { DropdownItem, NodeType } from '~/types'
import Paragraph from '~icons/tabler/letter-case'
import Heading from '~icons/tabler/heading'
import List from '~icons/tabler/list'
import Pin from '~icons/tabler/pin'
import EyeOff from '~icons/tabler/eye-off'
import ArrowUp from '~icons/tabler/arrow-up'
import ArrowDown from '~icons/tabler/arrow-down'
import SwitchHorizontal from '~icons/tabler/switch-horizontal'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import ListNumbers from '~icons/tabler/list-numbers'
import Trash from '~icons/tabler/trash'

const props = defineProps<{
  selectedNode?: any
  nodeIsPinned: boolean
  nodeIsSpoilered: boolean
}>()

const emit = defineEmits<{
  isOpen: [boolean]
}>()

const isOpen = ref(false)

const { editor } = useEditor()

function onOpen(value: boolean) {
  emit('isOpen', value)
  isOpen.value = value
}

function changeNode({
  type,
  level = 1,
}: {
  type: NodeType
  level?: 1 | 2
}) {
  if (!props.selectedNode) return

  if (type === 'heading')
    editor.value?.chain()
      .focus()
      .toggleHeading({ level: level! })
      .blur()
      .run()

  if (type === 'paragraph') {
    if (editor.value?.isActive('bulletList')) {
      editor.value?.chain()
        .focus()
        .toggleBulletList()
        .blur()
        .run()
    } else if (editor.value?.isActive('orderedList')) {
      editor.value?.chain()
        .focus()
        .toggleOrderedList()
        .blur()
        .run()
    }

    editor.value?.chain()
      .focus()
      .setParagraph()
      .blur()
      .run()
  }

  if (type === 'bulletList')
    editor.value?.chain()
      .focus()
      .toggleBulletList()
      .blur()
      .run()

  if (type === 'orderedList')
    editor.value?.chain()
      .focus()
      .toggleOrderedList()
      .blur()
      .run()
}

function toggleAttrubite(attr: string) {
  if (!props.selectedNode) return

  if (attr === 'pinned') {
    if (props.nodeIsPinned) {
      editor.value?.chain()
        .focus()
        .unpinned()
        .blur()
        .run()
    } else {
      editor.value?.chain()
        .focus()
        .pinned()
        .blur()
        .run()
    }
  } else if (attr === 'spoiler') {
    if (props.nodeIsSpoilered) {
      editor.value?.chain()
        .focus()
        .unsetSpoiler()
        .blur()
        .run()
    } else {
      editor.value?.chain()
        .focus()
        .setSpoiler()
        .blur()
        .run()
    }
  }
}

// function removeNode() {
//   editor.value?.chain()
//     .focus()
//     .deleteNode(state.nodeType as NodeType)
//     .blur()
//     .run()
// }

const nodeActions = computed<DropdownItem[]>(() => [
  {
    icon: Pin,
    label: props.nodeIsPinned ? 'Выводится в карточке' : 'Вывести в карточке',
    action: () => {
      toggleAttrubite('pinned')
      // state.nodeIsPinned = !state.nodeIsPinned
    },
    active: props.nodeIsPinned,
  },
  {
    icon: EyeOff,
    label: props.nodeIsSpoilered ? 'Скрывается' : 'Скрыть',
    action: () => {
      toggleAttrubite('spoiler')
      // state.nodeIsSpoilered = !state.nodeIsSpoilered
    },
    active: props.nodeIsSpoilered,
  },
  {
    separator: true,
  },
  {
    icon: ArrowUp,
    label: 'Вверх',
    // action: () => moveNode('up'),
    // disabled: nearNodesIndexes.value?.previousNodeIndex === -1
  },
  {
    icon: ArrowDown,
    label: 'Вниз',
    // action: () => moveNode('down'),
    // disabled: nearNodesIndexes.value?.nextNodeIndex === -1
  },
  {
    separator: true,
  },
  {
    icon: SwitchHorizontal,
    label: 'Поменять на',
    subitems: [
      {
        icon: Heading,
        label: 'Заголовок',
        // hide: !isTextNode.value,
        action: () => changeNode({ type: 'heading', level: 2 }),
        subitems: [
          {
            icon: Heading1,
            label: '1 уровня',
            action: () => changeNode({ type: 'heading', level: 1 }),
            // hide: headingLevel.value === 2,
          },
          {
            icon: Heading2,
            label: '2 уровня',
            action: () => changeNode({ type: 'heading', level: 2 }),
            // hide: headingLevel.value === 3,
          },
        ],
      },
      {
        icon: Paragraph,
        label: 'Текст',
        action: () => changeNode({ type: 'paragraph' }),
        // hide: isParagraphNode.value,
      },
      {
        icon: List,
        label: 'Список',
        action: () => changeNode({ type: 'bulletList' }),
        subitems: [
          {
            icon: List,
            label: 'Маркированный',
            action: () => changeNode({ type: 'bulletList' }),
            // hide: isBulletList.value,
          },
          {
            icon: ListNumbers,
            label: 'Нумерованный',
            action: () => changeNode({ type: 'orderedList' }),
            // hide: isOrderedList.value,
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
    // action: removeNode,
  },
])
</script>
