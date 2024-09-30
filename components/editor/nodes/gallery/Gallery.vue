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

export type Item = {
  id?: string
  src: string
  alt?: string
  thumbnail?: string
  width?: number
  height?: number
  type: MediaType
  uploaded: boolean
}

export type MediaType = 'image' | 'gif' | 'video'

const props = defineProps<NodeViewProps>()

const { updateNodeAttributes } = useEditor()
const { errorNotify } = useNotifications()

const pasteFromClipboardDialogRef = ref<InstanceType<typeof Dialog>>()
const itemsContainerRef = ref<InstanceType<typeof Flex>>()

const isEmpty = computed(() => !props.node.attrs.items.length)
const isSingle = computed(() => props.node.attrs.items.length === 1)
const isGallery = computed(() => props.node.attrs.items.length > 1)

const items = ref<Item[]>(Object.assign([], props.node.attrs.items).map((item: Item) => {
  if (item.id) return item

  item.id = window.crypto.randomUUID()

  return item
}))

const {
  reset,
  open: openFileSelectDialog,
  onChange,
} = useFileDialog({
  accept: GALLERY_NODE_ALLOWED_MIME_TYPES.join(', '),
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

      if (!GALLERY_NODE_ALLOWED_MIME_TYPES.includes(file.type as MimeType))
        return

      const base64Item = await getBase64FromFile(file)

      if (!base64Item) return

      const type = getFileTypeFromMimeType(file.type)
      const thumbnail = type === 'video'
        ? await getFrameFromBase64Video(base64Item as string)
        : undefined

      items.value?.push({
        src: base64Item as string,
        thumbnail,
        type: type as MediaType,
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
  const items = getFilesFromClipboard(e, GALLERY_NODE_ALLOWED_MIME_TYPES)

  if (!items) return

  addItems(items)
  pasteFromClipboardDialogRef.value?.setOpen(false)
}

async function onUpdate() {
  props.updateAttributes({ items: items.value })
}

function onUploaded(index: number, newItem: Item) {
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
    updateNodeAttributes({
      pos: props.getPos(),
      attrs: { galleryOpenFileFromDeviceDialog: false },
      preventAddToHistory: true
    })
  }

  if (props.node.attrs.galleryOpenFileFromClipboardDialog) {
    pasteFromClipboardDialogRef.value?.setOpen(true)
    updateNodeAttributes({
      pos: props.getPos(),
      attrs: { galleryOpenFileFromClipboardDialog: false },
      preventAddToHistory: true
    })
  }
})
</script>
