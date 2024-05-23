<template>
  <Dropdown :items="nodeActions" :side-offset="5" @isOpen="onOpen" ref="dropdownRef">
    <button
      class="p-1 rounded-lg hover:bg-gray-100 [&.active]:bg-gray-200 transition-colors"
      :class="{ active: isOpen }"
    >
      <ITablerGripVertical class="!w-5 !h-5" />
    </button>
  </Dropdown>
</template>

<script lang="ts" setup>
import type Dropdown from '~/components/global/dropdown/Dropdown.vue'
import type { DropdownItem, NodeType } from '~/types'
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
  selectedNode?: Node['pmViewDesc']
}>()

const emit = defineEmits<{
  isOpen: [boolean]
}>()

const dropdownRef = ref<InstanceType<typeof Dropdown>>()

const isOpen = ref(false)

const selectedNodeType = computed(() => props.selectedNode && props.selectedNode.node?.type.name)
const selectedNodeIsPinned = computed(() => props.selectedNode && props.selectedNode.node?.attrs.pin)
const selectedNodeIsSpoiler = computed(() => props.selectedNode && props.selectedNode.node?.attrs.spoiler)
const selectedNodeStartPos = computed(() => props.selectedNode?.posAtStart)
const selectedNodeEndPos = computed(() => props.selectedNode?.posAtEnd)
const nodeBefore = computed(() => {
  try {
    return editor.value?.$pos(props.selectedNode?.posAtStart!).before
  } catch (error) {
    return null
  }
})
const nodeAfter = computed(() => {
  try {
    return editor.value?.$pos(props.selectedNode?.posAtStart!).after
  } catch (error) {
    return null
  }
})

function onOpen(value: boolean) {
  emit('isOpen', value)
  isOpen.value = value
}

const { editor } = useEditor()

function moveNode(dir: 'up' | 'down') {
  if (dir === 'up') {
    if (!nodeBefore.value) return

    editor.value?.chain()
      .focus(selectedNodeStartPos.value)
      .deleteNode(selectedNodeType.value as NodeType)
      .run()

  } else {
    if (!nodeAfter.value) return
  }
}

function transformNode({
  type,
  level = 2,
}: {
  type: NodeType
  level?: 1 | 2
}) {
  if (!props.selectedNode) return

  if (type === 'heading')
    editor.value?.chain()
      .focus(selectedNodeStartPos.value)
      .toggleHeading({ level })
      .run()

  if (type === 'paragraph') {
    if (editor.value?.isActive('bulletList')) {
      editor.value?.chain()
        .focus(selectedNodeStartPos.value)
        .toggleBulletList()
        .run()
    } else if (editor.value?.isActive('orderedList')) {
      editor.value?.chain()
        .focus(selectedNodeStartPos.value)
        .toggleOrderedList()
        .run()
    }

    editor.value?.chain()
      .focus(selectedNodeStartPos.value)
      .setParagraph()
      .run()
  }

  if (type === 'bulletList')
    editor.value?.chain()
      .focus(selectedNodeStartPos.value)
      .toggleBulletList()
      .run()

  if (type === 'orderedList')
    editor.value?.chain()
      .focus(selectedNodeStartPos.value)
      .toggleOrderedList()
      .run()
}

function toggleAttrubite(attr: string) {
  if (!props.selectedNode) return

  if (attr === 'pin') {
    editor.value?.chain()
      .focus(selectedNodeStartPos.value!)
      .togglePin()
      .run()
  } else if (attr === 'spoiler') {
    editor.value?.chain()
      .focus(selectedNodeStartPos.value!)
      .toggleSpoiler()
      .run()
  }
}

function removeNode() {
  editor.value?.chain()
    .focus(selectedNodeStartPos.value)
    .deleteNode(selectedNodeType.value as NodeType)
    .run()

  dropdownRef.value?.setOpen(false)
  emit('isOpen', false)
}

const nodeActions = computed<DropdownItem[]>(() => [
  {
    icon: Pin,
    label: selectedNodeIsPinned.value ? 'Выводится в карточке' : 'Вывести в карточке',
    action: () => toggleAttrubite('pin'),
    active: selectedNodeIsPinned.value,
  },
  {
    icon: EyeOff,
    label: selectedNodeIsSpoiler.value ? 'Скрывается' : 'Скрыть',
    action: () => toggleAttrubite('spoiler'),
    active: selectedNodeIsSpoiler.value,
  },
  {
    separator: true,
  },
  {
    icon: ArrowUp,
    label: 'Вверх',
    action: () => moveNode('up'),
    disabled: !!!nodeBefore.value
  },
  {
    icon: ArrowDown,
    label: 'Вниз',
    action: () => moveNode('down'),
    disabled: !!!nodeAfter.value
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
            hide: props.selectedNode?.node?.attrs.level === 1,
          },
          {
            icon: Heading2,
            label: '2 уровня',
            action: () => transformNode({ type: 'heading', level: 2 }),
            hide: props.selectedNode?.node?.attrs.level === 2,
          },
        ],
      },
      {
        icon: Paragraph,
        label: 'Текст',
        action: () => transformNode({ type: 'paragraph' }),
        hide: props.selectedNode?.node?.type.name === 'paragraph',
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
            hide: props.selectedNode?.node?.type.name === 'bulletList',
          },
          {
            icon: ListNumbers,
            label: 'Нумерованный',
            action: () => transformNode({ type: 'orderedList' }),
            hide: props.selectedNode?.node?.type.name === 'orderedList',
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
