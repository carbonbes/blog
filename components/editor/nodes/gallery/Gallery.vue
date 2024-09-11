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

  <Dialog class="w-full max-w-80" @close="imageUrl = ''" ref="dialogRef">
    <UITextArea autofocus
      placeholder="Ссылка на картинку"
      v-model="imageUrl"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import type Flex from '~/components/global/Flex.vue'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import type Dialog from '~/components/global/Dialog.vue'
import GalleryItem from '~/components/editor/nodes/gallery/GalleryItem.vue'

export type Item = {
  src: string
  alt: string
  width: number
  height: number
  type: 'image' | 'video' | 'gif'
}

const props = defineProps<NodeViewProps>()

const itemsContainerRef = ref<InstanceType<typeof Flex>>()

const isEmpty = computed(() => !props.node.attrs.items.length)
const isSingle = computed(() => props.node.attrs.items.length === 1)
const isGallery = computed(() => props.node.attrs.items.length > 1)

const FILE_MAX_SIZE = 1024 * 1024 * 10

const items = ref<{
  id?: string
  src?: string
  width?: number
  height?: number
  loading?: boolean
}[]>(Object.assign([], props.node.attrs.items))

const dialogRef = ref<InstanceType<typeof Dialog>>()

const imageUrl = ref('')

watch(imageUrl, async (v) => {
  if (!v || !isValidImageURL(v)) return

  dialogRef.value?.setOpen(false)
  await uploadImage(v)
  imageUrl.value = ''
})

const { reset, open, onChange } = useFileDialog({
  accept: 'image/png, image/webp, image/jpg, image/jpeg, image/gif',
})

const { add } = useNotifications()

onChange(async (files) => {
  if (!files) return

  const images = Array.from(files)

  await uploadImages(images)

  reset()
})

async function uploadImages(files: File[]) {
  await Promise.all(
    Object.values(files).map(async (file) => {
      if (file.size > FILE_MAX_SIZE) {
        add({
          type: 'error',
          title: 'Ошибка',
          text: 'Слишком большой файл',
        })

        return
      }

      const id = window.crypto.randomUUID()

      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        items.value.push({
          id,
          src: fileReader.result as string,
          loading: true,
        })

        props.updateAttributes({
          items: items.value,
        })
      }

      try {
        const { data: { secure_url, width, height }} = await uploadMediaByFile(file)

        const i = items.value.findIndex((image) => image.id === id)

        items.value[i].src = secure_url
        items.value[i].width = width
        items.value[i].height = height

        delete items.value[i].id
        delete items.value[i].loading
      } catch (error: any) {
        const i = items.value.findIndex((image) => image.id === id)
        items.value.splice(i, 1)

        props.updateAttributes({
          items: items.value,
        })

        add({
          type: 'error',
          title: 'Ошибка',
          text: error.data.message,
        })
      } finally {
        reset()
      }
    })
  )

  props.updateAttributes({
    items: items.value,
    forUpload: [],
  })
}

async function uploadImage(imageUrl: string) {
  const id = window.crypto.randomUUID()

  items.value.push({ id, src: imageUrl, loading: true })

  try {
    const { data: { secure_url, width, height } } = await uploadMediaByUrl(imageUrl)

    const i = items.value.findIndex((image) => image.id === id)

    items.value[i].src = secure_url
    items.value[i].width = width
    items.value[i].height = height

    delete items.value[i].id
    delete items.value[i].loading

    props.updateAttributes({
      items: items.value,
      forUpload: [],
    })
  } catch (error: any) {
    const i = items.value.findIndex((image) => image.id === id)
    items.value.splice(i, 1)

    props.updateAttributes({
      items: items.value,
    })

    add({
      type: 'error',
      title: 'Ошибка',
      text: error.data.message,
    })
  } finally {
    reset()
  }
}

function remove(i: number) {
  items.value.splice(i, 1)
  props.updateAttributes({ items: items.value })
}

async function tryUploadImages() {
  const files: File[] | string = props.node.attrs.forUpload

  if (!files.length) return

  if (typeof files === 'string') {
    await uploadImage(files)
  } else {
    await uploadImages(files)
  }
}

onMounted(async () => {
  tryUploadImages()

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
