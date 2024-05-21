<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
import type { DropdownItem, NodeType } from '~/types'
import Paragraph from '~icons/tabler/letter-case'
import Heading from '~icons/tabler/heading'
import List from '~icons/tabler/list'
import Photo from '~icons/tabler/photo'
import Heading2 from '~icons/tabler/h2'
import Heading3 from '~icons/tabler/h3'
import ListNumbers from '~icons/tabler/list-numbers'
import type { JSONContent } from '@tiptap/vue-3'

const props = defineProps<{
  selectedNode?: any
}>()

const emit = defineEmits<{
  isOpen: [boolean]
}>()

function insertNode({ type, level }: { type: NodeType, level?: 1 | 2 }) {
  if (!props.selectedNode) return

  let content: JSONContent[] | undefined

  if (['bulletList', 'orderedList'].includes(type))
    content = [{ type: 'listItem', content: [{ type: 'paragraph', content: [] }] }]

  editor.value?.chain()
    .insertContentAt(state.nodePosEnd!, {
      type,
      attrs: {
        level,
      },
      content
    })
    .focus()
    .run()
}

const nodesList = computed<DropdownItem[]>(() => [
  {
    icon: Paragraph,
    label: 'Текст',
    action: () => insertNode({ type: 'paragraph' }),
  },
  {
    icon: Heading,
    label: 'Заголовок',
    action: () => insertNode({ type: 'heading' }),
    subitems: [
      {
        icon: Heading2,
        label: '2 уровня',
        action: () => insertNode({ type: 'heading', level: 2 }),
      },
      {
        icon: Heading3,
        label: '3 уровня',
        action: () => insertNode({ type: 'heading', level: 3 }),
      },
    ],
  },
  {
    icon: List,
    label: 'Список',
    action: () => insertNode({ type: 'bulletList' }),
    subitems: [
      {
        icon: List,
        label: 'Маркированный',
        action: () => insertNode({ type: 'bulletList' }),
      },
      {
        icon: ListNumbers,
        label: 'Нумерованный',
        action: () => insertNode({ type: 'orderedList' }),
      },
    ],
  },
  {
    icon: Photo,
    type: 'gallery',
    label: 'Картинка / Галерея',
    action: () => insertNode({ type: 'gallery' }),
  },
])
</script>
