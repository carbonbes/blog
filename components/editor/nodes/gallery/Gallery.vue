<template>
  <NodeViewWrapper
    class="flex flex-col"
    :class="{ 'p-3 sm:p-4 bg-gray-100 rounded-xl': isEmpty || !isSingle }"
    contenteditable="false"
    draggable="false"
  >
    <Flex col>
      <Flex v-if="isEmpty" col itemsCenter class="gap-8">
        <ITablerPhoto class="!size-10" />

        <Flex class="gap-2">
          <UIButton @click="openFileSelectDialog"> Выбрать файлы </UIButton>

          <UIButton @click="pasteFromClipboardDialogRef?.setOpen(true)">
            Вставить из буфера
          </UIButton>
        </Flex>
      </Flex>

      <Flex v-else class="gap-4 flex-wrap" ref="itemsContainerRef">
        <GalleryItem
          v-for="(item, i) in items"
          :key="i"
          :item
          :isSingle
          :isGallery
          :parent="itemsContainerRef?.$el"
          @loaded="(newItem) => items.splice(i, 1, newItem)"
          @remove="remove(i)"
          @openFileFromDeviceDialog="openFileSelectDialog"
          @openFileFromClipboardDialog="
            pasteFromClipboardDialogRef?.setOpen(true)
          "
        />
      </Flex>

      <Flex v-if="isGallery" class="mt-10 gap-2">
        <Tooltip tooltip="Выбрать еще с устройства">
          <UIButton size="s" @click="openFileSelectDialog">
            <ITablerPlus />
          </UIButton>
        </Tooltip>

        <Tooltip tooltip="Вставить еще из буфера">
          <UIButton
            size="s"
            @click="pasteFromClipboardDialogRef?.setOpen(true)"
          >
            <ITablerClipboard />
          </UIButton>
        </Tooltip>
      </Flex>
    </Flex>
  </NodeViewWrapper>

  <Dialog
    class="w-full max-w-80"
    ref="pasteFromClipboardDialogRef"
    @closeAutoFocus="(e) => e.preventDefault()"
  >
    <UITextArea
      autofocus
      placeholder="Вставьте в это поле файл/файлы"
      @paste="onPaste"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import type Flex from '~/components/global/Flex.vue'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import type Dialog from '~/components/global/Dialog.vue'
import GalleryItem from '~/components/editor/nodes/gallery/GalleryItem.vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import getFileTypeFromMimeType from '~/utils/getFileTypeFromMimeType'
import { FILE_MAX_SIZE } from '~/utils/consts'

export type Item = {
  src: string
  alt?: string
  thumbnail?: string
  width?: number
  height?: number
  type: MediaType
  uploaded: boolean
}

export type MediaType = 'image' | 'gif' | 'video'

const allowedMimeTypes = [
  'image/png',
  'image/webp',
  'image/jpg',
  'image/jpeg',
  'image/tiff',
  'image/bmp',
  'image/heic',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-flv',
  'video/mpeg',
]

const props = defineProps<NodeViewProps>()

const { errorNotify } = useNotifications()

const pasteFromClipboardDialogRef = ref<InstanceType<typeof Dialog>>()
const itemsContainerRef = ref<InstanceType<typeof Flex>>()

const isEmpty = computed(() => !props.node.attrs.items.length)
const isSingle = computed(() => props.node.attrs.items.length === 1)
const isGallery = computed(() => props.node.attrs.items.length > 1)

const items = ref<Item[]>(Object.assign([], props.node.attrs.items))

useSortable(itemsContainerRef as unknown as HTMLElement, items, {
  handle: '#gallery-node-item-grip',
  animation: 250,
  onUpdate: async (e) => {
    const items = Object.assign([], props.node.attrs.items)
    items.splice(e.newIndex, 0, items.splice(e.oldIndex, 1)[0])
    await nextTick()
    props.updateAttributes({ items })
  },
})

const {
  reset,
  open: openFileSelectDialog,
  onChange,
} = useFileDialog({
  accept: allowedMimeTypes.join(', '),
})

async function addItems(files: File[]) {
  await Promise.all(
    Object.values(files).map(async (file) => {
      if (file.size > FILE_MAX_SIZE) {
        errorNotify({
          title: 'Ошибка',
          text: 'Слишком большой файл',
        })

        return
      }

      if (!allowedMimeTypes.includes(file.type)) return

      const base64Item = await getBase64FromFile(file)

      if (!base64Item) return

      items.value?.push({
        src: base64Item as string,
        type: getFileTypeFromMimeType(file.type) as MediaType,
        uploaded: false,
      })
    })
  )

  props.updateAttributes({
    items: items.value,
  })
}

onChange(async (fileList) => {
  if (!fileList) return

  const files = Array.from(fileList)

  addItems(files)
  reset()
})

function onPaste(e: ClipboardEvent) {
  const items = getFileFromClipboard(e)

  if (!items) return

  addItems(items)
  pasteFromClipboardDialogRef.value?.setOpen(false)
}

function remove(i: number) {
  items.value.splice(i, 1)
  props.updateAttributes({ items: items.value })
}

onMounted(async () => {
  const items = props.node.attrs.forUpload as File[]

  if (items) {
    await addItems(items)
    props.updateAttributes({ forUpload: null })
  }

  await nextTick()

  if (props.node.attrs.galleryOpenFileFromDeviceDialog) {
    openFileSelectDialog()
    props.updateAttributes({ galleryOpenFileFromDeviceDialog: false })
  }

  if (props.node.attrs.galleryOpenFileFromClipboardDialog) {
    pasteFromClipboardDialogRef.value?.setOpen(true)
    props.updateAttributes({ galleryOpenFileFromClipboardDialog: false })
  }
})
</script>
