<template>
  <NodeViewWrapper
    class="flex flex-col"
    :class="{ 'p-3 sm:p-4 bg-gray-100 rounded-xl': isEmpty || !isSingle }"
    contenteditable="false"
  >
    <Flex col>
      <Flex v-if="isEmpty" col itemsCenter class="gap-8">
        <ITablerPhoto class="!size-10" />
        
        <Flex class="gap-2">
          <UIButton @click="open">
            Выбрать файлы
          </UIButton>

          <UIButton @click="dialogRef?.setOpen(true)">
            Вставить по ссылке
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
          @remove="remove(i)"
          @openFileFromDeviceDialog="open"
          @openFileFromUrlDialog="dialogRef?.setOpen(true)"
        />
      </Flex>

      <Flex
        v-if="isGallery"
        class="mt-10 gap-2"
      >
        <Tooltip tooltip="Выбрать из галереи">
          <UIButton size="s" @click="open">
            <ITablerPlus />
          </UIButton>
        </Tooltip>

        <Tooltip tooltip="Добавить по ссылке">
          <UIButton size="s" @click="dialogRef?.setOpen(true)">
            <ITablerLink />
          </UIButton>
        </Tooltip>
      </Flex>
    </Flex>
  </NodeViewWrapper>

  <Dialog
    class="w-full max-w-80"
    @close="itemFromUrl = ''"
    ref="dialogRef"
  >
    <UITextArea autofocus
      placeholder="Ссылка на картинку"
      v-model="itemFromUrl"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import type Flex from '~/components/global/Flex.vue'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import type Dialog from '~/components/global/Dialog.vue'
import GalleryItem from '~/components/editor/nodes/gallery/GalleryItem.vue'
import { useSortable } from '@vueuse/integrations/useSortable'

export type Item = {
  src: string
  alt?: string
  thumbnail?: string
  width?: number
  height?: number
  type: 'image' | 'video' | 'gif'
  uploaded: boolean
}

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
  'video/mpeg'
]

const props = defineProps<NodeViewProps>()

const { add: notify } = useNotifications()

const dialogRef = ref<InstanceType<typeof Dialog>>()
const itemsContainerRef = ref<InstanceType<typeof Flex>>()

const isEmpty = computed(() => !props.node.attrs.items.length)
const isSingle = computed(() => props.node.attrs.items.length === 1)
const isGallery = computed(() => props.node.attrs.items.length > 1)

const items = ref<Item[]>(props.node.attrs.items)

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

const { reset, open, onChange } = useFileDialog({
  accept: allowedMimeTypes.join(', ')
})

const FILE_MAX_SIZE = 1024 * 1024 * 10

onChange(async (fileList) => {
  if (!fileList) return

  const files = Array.from(fileList)

  Object.values(files).forEach(async (file) => {
    if (file.size > FILE_MAX_SIZE) {
      notify({
        type: 'error',
        title: 'Ошибка',
        text: 'Слишком большой файл',
      })

      return
    }

    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    if (!allowedMimeTypes.includes(file.type)) return

    console.log(fileReader.result)

    // fileReader.onload = () => {
    //   items.value?.push({
    //     src: fileReader.result as string,
    //     type: mimeType as 'image' | 'gif' | 'video',
    //     uploaded: false,
    //   })
    // }
  })

  reset()
})

const itemFromUrl = ref('')

watch(itemFromUrl, async (v) => {
  if (!v || !isValidImageURL(v)) return

  items.value.push({ src: v, uploaded: false })
  dialogRef.value?.setOpen(false)
  itemFromUrl.value = ''
})

function remove(i: number) {
  items.value.splice(i, 1)
  props.updateAttributes({ items: items.value })
}

onMounted(async () => {
  await nextTick()

  if (props.node.attrs.galleryOpenFileFromDeviceDialog) {
    open()
    props.updateAttributes({ galleryOpenFileFromDeviceDialog: false })
  }

  if (props.node.attrs.galleryOpenFileFromUrlDialog) {
    dialogRef.value?.setOpen(true)
    props.updateAttributes({ galleryOpenFileFromUrlDialog: false })
  }
})
</script>
