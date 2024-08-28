<template>
  <BottomSheet class="top-full !bg-gray-100 after:!bg-gray-100" @close="emit('close')" ref="bottomsheetRef">
    <Flex col class="w-full pb-[25vh] !flex gap-4">
      <UIButton
        v-for="(button, i) in buttons"
        :key="i"
        variant="secondary"
        size="l"
        class="flex items-center gap-3"
        @click="button.action"
      >
        <Component :is="button.icon" />
        {{ button.label }}
      </UIButton>
    </Flex>
  </BottomSheet>
</template>

<script lang="ts" setup>
import type BottomSheet from '~/components/global/BottomSheet.vue'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import Paragraph from '~icons/tabler/letter-case'
import ListNumbers from '~icons/tabler/list-numbers'
import List from '~icons/tabler/list'
import Photo from '~icons/tabler/photo'
import Link from '~icons/tabler/link'
import Divider from '~icons/tabler/divide'
import type { HeadingLevel, NodeType } from '~/types'

const emit = defineEmits<{
  close: any
  insertNode: [type: NodeType, level?: HeadingLevel]
}>()

const buttons = markRaw([
  {
    icon: Heading1,
    label: 'Заголовок 1',
    action: () => emit('insertNode', 'heading', 1)
  },
  {
    icon: Heading2,
    label: 'Заголовок 2',
    action: () => emit('insertNode', 'heading', 2)
  },
  {
    icon: Paragraph,
    label: 'Текст',
    action: () => emit('insertNode', 'paragraph')
  },
  {
    icon: ListNumbers,
    label: 'Нумерованный список',
    action: () => emit('insertNode', 'orderedList')
  },
  {
    icon: List,
    label: 'Маркированный список',
    action: () => emit('insertNode', 'bulletList')
  },
  {
    icon: Photo,
    label: 'Картинка / Галерея',
    action: () => emit('insertNode', 'gallery')
  },
  {
    icon: Link,
    label: 'Ссылка',
    action: () => emit('insertNode', 'link')
  },
  {
    icon: Divider,
    label: 'Разделитель',
    action: () => emit('insertNode', 'delimiter')
  },
])

const bottomsheetRef = ref<InstanceType<typeof BottomSheet>>()

function setOpen(value: boolean) {
  bottomsheetRef.value?.setOpen(value)
}

defineExpose({ setOpen })
</script>
