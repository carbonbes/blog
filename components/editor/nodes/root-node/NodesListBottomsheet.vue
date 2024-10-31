<template>
  <Drawer
    class="!bg-gray-100 after:!bg-gray-100"
    ref="drawerRef"
    @update:open="onOpen"
  >
    <Flex col class="flex gap-4">
      <UIButton
        v-for="(button, i) in buttons"
        :key="i"
        variant="secondary"
        size="l"
        class="flex items-center gap-3 !rounded-2xl !shadow"
        @click="button.action"
      >
        <Component :is="button.icon" />
        {{ button.label }}
      </UIButton>
    </Flex>
  </Drawer>
</template>

<script lang="ts" setup>
import type Drawer from '~/components/global/Drawer.vue'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import Paragraph from '~icons/tabler/letter-case'
import ListNumbers from '~icons/tabler/list-numbers'
import List from '~icons/tabler/list'
import Photo from '~icons/tabler/photo'
import Link from '~icons/tabler/link'
import Divider from '~icons/tabler/divide'

const emits = defineEmits<{
  onOpen: [boolean]
}>()

function onOpen(value: boolean) {
  emits('onOpen', value)
}

const { insertNode } = useEditor()

const buttons = markRaw([
  {
    icon: Heading1,
    label: 'Заголовок 1',
    action: () => {
      insertNode({ type: 'heading', attrs: { level: 1 } })
      setOpen(false)
    },
  },
  {
    icon: Heading2,
    label: 'Заголовок 2',
    action: () => {
      insertNode({ type: 'heading', attrs: { level: 2 } })
      setOpen(false)
    },
  },
  {
    icon: Paragraph,
    label: 'Текст',
    action: () => {
      insertNode({ type: 'paragraph' })
      setOpen(false)
    },
  },
  {
    icon: ListNumbers,
    label: 'Нумерованный список',
    action: () => {
      insertNode({ type: 'orderedList' })
      setOpen(false)
    },
  },
  {
    icon: List,
    label: 'Маркированный список',
    action: () => {
      insertNode({ type: 'bulletList' })
      setOpen(false)
    },
  },
  {
    icon: Photo,
    label: 'Медиа с устройства',
    action: () => {
      insertNode({
        type: 'gallery',
        attrs: { galleryOpenFileFromDeviceDialog: true },
      })
      setOpen(false)
    },
  },
  {
    icon: Photo,
    label: 'Медиа из буфера',
    action: () => {
      insertNode({
        type: 'gallery',
        attrs: { galleryOpenFileFromClipboardDialog: true },
      })
      setOpen(false)
    },
  },
  {
    icon: Link,
    label: 'Ссылка',
    action: () => {
      insertNode({ type: 'link' })
      setOpen(false)
    },
  },
  {
    icon: Divider,
    label: 'Разделитель',
    action: () => {
      insertNode({ type: 'separator' })
      setOpen(false)
    },
  },
])

const drawerRef = ref<InstanceType<typeof Drawer>>()

function setOpen(value: boolean) {
  drawerRef.value?.setOpen(value)
  onOpen(false)
}

defineExpose({ setOpen })
</script>
