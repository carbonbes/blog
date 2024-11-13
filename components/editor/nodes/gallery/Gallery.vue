<template>
  <NodeViewWrapper
    class="flex flex-col"
    :class="{ 'p-3 sm:p-4 bg-gray-100 rounded-xl': isEmpty || !isSingle }"
    contenteditable="false"
    data-prevent-focus="true"
  >
    <Flex col>
      <Flex v-if="isEmpty" col itemsCenter class="gap-8">
        <ITablerPhoto class="!size-10" />

        <Flex class="gap-2">
          <UIButton class="rounded-xl" @click="openFileSelectDialog"> Выбрать файлы </UIButton>

          <UIButton class="rounded-xl" @click="pasteFromClipboardDialogRef?.setOpen(true)">
            Вставить из буфера
          </UIButton>
        </Flex>
      </Flex>

      <Draggable
        v-else
        v-model="items"
        item-key="id"
        :animation="200"
        :disabled="items.length === 1"
        @update="onUpdate"
        class="flex gap-4 flex-wrap"
        ref="itemsContainerRef"
      >
        <template #item="{ element, index }">
          <GalleryItem
            :item="element"
            :parent="itemsContainerRef?.$el"
            :isSingle
            :isGallery
            :isDraggable="items.length !== 1"
            @uploaded="(newItem) => onUploaded(index, newItem)"
            @remove="onRemove(index)"
            @openFileFromDeviceDialog="openFileSelectDialog"
            @openFileFromClipboardDialog="pasteFromClipboardDialogRef?.setOpen(true)"
          />
        </template>
      </Draggable>

      <Flex v-if="isGallery" class="mt-10 gap-2">
        <Tooltip tooltip="Выбрать еще с устройства">
          <UIButton size="s" class="rounded-xl" @click="openFileSelectDialog">
            <ITablerPlus />
          </UIButton>
        </Tooltip>

        <Tooltip tooltip="Вставить еще из буфера">
          <UIButton
            size="s"
            class="rounded-xl"
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
import type { MimeType } from 'file-type'
import Draggable from 'vuedraggable'
import type { StorageMedia } from '~/types'

export type GalleryItem = {
  id?: string
  src: string
  description?: string
  thumbnail?: string
  width?: number
  height?: number
  type: MediaType
  media?: StorageMedia
  uploaded: boolean
}

export type MediaType = 'image' | 'video'

const props = defineProps<NodeViewProps>()

const { updateNodeAttributes } = useEditor()
const { errorToastify } = useToasts()

const pasteFromClipboardDialogRef = ref<InstanceType<typeof Dialog>>()
const itemsContainerRef = ref<InstanceType<typeof Flex>>()

const isEmpty = computed(() => !props.node.attrs.items.length)
const isSingle = computed(() => props.node.attrs.items.length === 1)
const isGallery = computed(() => props.node.attrs.items.length > 1)

const items = ref<GalleryItem[]>(Object.assign([], props.node.attrs.items).map((item: GalleryItem) => {
  if (item.id) return item

  item.id = window.crypto.randomUUID()

  return item
}))

const {
  reset,
  open: openFileSelectDialog,
  onChange,
} = useFileDialog({
  accept: ALLOWED_MEDIAFILE_MIME_TYPES.join(', '),
})

async function addItems(files: File[]) {
  await Promise.all(
    Object.values(files).map(async (file) => {
      if (file.size > MEDIAFILE_MAX_SIZE) {
        errorToastify({
          title: 'Ошибка',
          text: 'Слишком большой файл',
        })

        return
      }

      if (!ALLOWED_MEDIAFILE_MIME_TYPES.includes(file.type as MimeType))
        return

      const base64Item = await getBase64FromFile(file)

      if (!base64Item) return

      const type = getFileTypeFromMimeType(file.type)

      const thumbnail = type === 'video'
        ? await getScreenshotFromBase64Video(base64Item as string)
        : undefined

      items.value?.push({
        src: base64Item as string,
        thumbnail,
        type: type as MediaType,
        uploaded: false,
      })
    })
  )

  updateNodeAttributes({
    pos: props.getPos(),
    attrs: { items: items.value },
    preventAddToHistory: true,
    preventUpdateEmit: true
  })
}

onChange(async (fileList) => {
  if (!fileList) return

  const files = Array.from(fileList)

  addItems(files)
  reset()
})

function onPaste(e: ClipboardEvent) {
  const items = getFilesFromClipboard(e, ALLOWED_MEDIAFILE_MIME_TYPES)

  if (!items) return

  addItems(items)
  pasteFromClipboardDialogRef.value?.setOpen(false)
}

async function onUpdate() {
  props.updateAttributes({ items: items.value })
}

function onUploaded(index: number, newItem: GalleryItem) {
  items.value.splice(index, 1, newItem)
  props.updateAttributes({ items: items.value })
}

function onRemove(index: number) {
  items.value.splice(index, 1)
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
