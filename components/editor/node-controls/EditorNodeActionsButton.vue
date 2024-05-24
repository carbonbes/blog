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
import type { Node } from '@tiptap/pm/model'
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
  selectedNode?: Node
}>()

const emit = defineEmits<{
  isOpen: [boolean]
}>()

const dropdownRef = ref<InstanceType<typeof Dropdown>>()

const isOpen = ref(false)

const selectedNodeType = computed(() => props.selectedNode && props.selectedNode.type.name)
const selectedNodeIsPinned = computed(() => props.selectedNode && props.selectedNode.attrs.pin)
const selectedNodeIsSpoiler = computed(() => props.selectedNode && props.selectedNode.attrs.spoiler)
const previousNode = computed(() => {
  const currentNodeSelected = editor.value?.state.selection

  if (!currentNodeSelected) return null

  if (currentNodeSelected?.from! - 1 <= 0) return null

  return editor.value?.state.doc.resolve(currentNodeSelected?.from! - 1)?.nodeBefore
})
const nextNode = computed(() => {
  const currentNodeSelected = editor.value?.state.selection

  if (!currentNodeSelected) return null

  if (currentNodeSelected?.to! + 1 >= editor.value?.state.doc.nodeSize!) return null

  return editor.value?.state.doc.resolve(currentNodeSelected?.to! + 1)?.nodeAfter
})

function onOpen(value: boolean) {
  emit('isOpen', value)
  isOpen.value = value
}

const { editor } = useEditor()

function moveNode(dir: 'up' | 'down') {
  if (dir === 'up') {
    if (!previousNode.value) return


  } else {
    if (!nextNode.value) return
    
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
      .toggleHeading({ level })
      .run()

  if (type === 'paragraph') {
    if (editor.value?.isActive('bulletList')) {
      editor.value?.chain()
        .toggleBulletList()
        .run()
    } else if (editor.value?.isActive('orderedList')) {
      editor.value?.chain()
        .toggleOrderedList()
        .run()
    }

    editor.value?.chain()
      .setParagraph()
      .run()
  }

  if (type === 'bulletList')
    editor.value?.chain()
      .toggleBulletList()
      .run()

  if (type === 'orderedList')
    editor.value?.chain()
      .toggleOrderedList()
      .run()
}

function toggleAttrubite(attr: string) {
  if (!props.selectedNode) return

  if (attr === 'pin') {
    editor.value?.chain()
      .togglePin()
      .run()
  }
  
  if (attr === 'spoiler') {
    editor.value?.chain()
      .toggleSpoiler()
      .run()
  }
}

function removeNode() {
  editor.value?.commands.deleteSelection()

  dropdownRef.value?.setOpen(false)
  emit('isOpen', false)
}

const nodeActions = computed<DropdownItem[]>(() => [
  {
    icon: Pin,
    label: selectedNodeIsPinned.value ? 'Выводится в карточке' : 'Вывести в карточке',
    action: () => toggleAttrubite('pin'),
    active: selectedNodeIsPinned.value,
    disabled: !selectedNodeIsPinned.value && editor.value?.storage.globalAttrs.pinned === 2
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
            hide: props.selectedNode?.attrs.level === 1,
          },
          {
            icon: Heading2,
            label: '2 уровня',
            action: () => transformNode({ type: 'heading', level: 2 }),
            hide: props.selectedNode?.attrs.level === 2,
          },
        ],
      },
      {
        icon: Paragraph,
        label: 'Текст',
        action: () => transformNode({ type: 'paragraph' }),
        hide: props.selectedNode?.type.name === 'paragraph',
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
            hide: props.selectedNode?.type.name === 'bulletList',
          },
          {
            icon: ListNumbers,
            label: 'Нумерованный',
            action: () => transformNode({ type: 'orderedList' }),
            hide: props.selectedNode?.type.name === 'orderedList',
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
