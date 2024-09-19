<template>
  <Dropdown
    :items="nodesList"
    :side-offset="5"
    @isOpen="setOpen"
    class="w-48"
    ref="dropdownRef"
  >
    <UIButton
      size="s"
      variant="secondary"
      :class="{ '!bg-gray-200 !ring-gray-200 !opacity-100': isOpen }"
    >
        <ITablerPlus class="!size-4" />
      </UIButton>
  </Dropdown>
</template>

<script lang="ts" setup>
import type Dropdown from '~/components/global/dropdown/Dropdown.vue'
import Heading from '~icons/tabler/heading'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import Paragraph from '~icons/tabler/letter-case'
import ListNumbers from '~icons/tabler/list-numbers'
import List from '~icons/tabler/list'
import Photo from '~icons/tabler/photo'
import Devices from '~icons/tabler/devices'
import Clipboard from '~icons/tabler/clipboard'
import Link from '~icons/tabler/link'
import Separator from '~icons/tabler/separator'

const emit = defineEmits<{
  isOpen: [boolean]
}>()

const dropdownRef = ref<InstanceType<typeof Dropdown>>()

const isOpen = ref(false)

function setOpen(value: boolean) {
  emit('isOpen', value)
  isOpen.value = value
}

function close() {
  dropdownRef.value?.setOpen(false)
  emit('isOpen', false)
}

const { insertNode } = useEditor()

const nodesList = markRaw([
  {
    icon: Heading,
    label: 'Заголовок',
    subitems: [
      {
        icon: Heading1,
        label: 'Заголовок 1',
        action: () => {
          insertNode({ type: 'heading', attrs: { level: 1 } })
          close()
        }
      },
      {
        icon: Heading2,
        label: 'Заголовок 2',
        action: () => {
          insertNode({ type: 'heading', attrs: { level: 2 } })
          close()
        }
      },
    ]
  },
  {
    icon: Paragraph,
    label: 'Текст',
    action: () => {
      insertNode({ type: 'paragraph' })
      close()
    }
  },
  {
    icon: List,
    label: 'Список',
    subitems: [
      {
        icon: ListNumbers,
        label: 'Нумерованный список',
        action: () => {
          insertNode({ type: 'orderedList' })
          close()
        }
      },
      {
        icon: List,
        label: 'Маркированный список',
        action: () => {
          insertNode({ type: 'bulletList' })
          close()
        }
      },
    ]
  },
  {
    icon: Photo,
    label: 'Медиа',
    subitems: [
      {
        icon: Devices,
        label: 'Медиа с устройства',
        action: () => {
          insertNode({ type: 'gallery', attrs: { galleryOpenFileFromDeviceDialog: true } })
          close()
        }
      },
      {
        icon: Clipboard,
        label: 'Медиа из буфера',
        action: () => {
          insertNode({ type: 'gallery', attrs: { galleryOpenFileFromClipboardDialog: true } })
          close()
        }
      }
    ]
  },
  {
    icon: Link,
    label: 'Ссылка',
    action: () => {
      insertNode({ type: 'link' })
      close()
    }
  },
  {
    icon: Separator,
    label: 'Разделитель',
    action: () => {
      insertNode({ type: 'separator' })
      close()
    }
  }
])
</script>
