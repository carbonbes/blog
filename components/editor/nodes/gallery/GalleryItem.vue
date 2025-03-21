<template>
  <div
    class="relative"
    :class="{ 'w-full': isSingle }"
    @touchstart="onTouch(true)"
    @touchend="onTouch(false)"
  >
    <Tooltip v-if="isGallery && !state.loading" tooltip="Удалить">
      <button
        class="absolute top-0 left-full -translate-y-1/2 -translate-x-1/2 p-1 bg-white border border-gray-200/75 rounded-full group/remove-btn z-[1]"
        @click="emits('remove', item.id as string)"
      >
        <ITablerX
          class="!size-3 group-hover/remove-btn:text-red-500 transition-colors"
        />
      </button>
    </Tooltip>

    <Flex
      :center="isSingle"
      class="bg-gray-100 rounded-xl overflow-hidden"
      :class="{ 'inner-border': isGallery }"
    >
      <Image
        v-if="item.type === 'image'"
        :src="item.src"
        :alt="item.description"
        :originalWidth="item.width"
        :originalHeight="item.height"
        :parent
        :zoomable="isSingle"
        :lightboxItem="isGallery"
        :class="{
          'pointer-events-none opacity-50': state.loading,
          'max-h-80': isSingle,
          'w-20 h-20 object-cover': isGallery,
        }"
      />

      <Video
        v-else-if="item.type === 'video'"
        :src="item.src"
        :description="item.description"
        :thumbnail="item.thumbnail"
        :originalWidth="item.width"
        :originalHeight="item.height"
        :autoplay="isSingle"
        :controls="isSingle"
        :parent
        :lightboxItem="isGallery && item.uploaded"
        :classes="{
          'pointer-events-none opacity-50': state.loading,
          'w-full aspect-video': isSingle,
          'w-20 h-20 !bg-cover': isGallery,
        }"
        ref="videoRef"
      />

      <Flex v-if="!item.uploaded" center class="absolute inset-0">
        <Loader color="!bg-black" />
      </Flex>
    </Flex>

    <Flex
      v-if="isSingle"
      class="absolute inset-0 p-2 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity pointer-events-none"
    >
      <Flex
        class="gap-2 pointer-events-auto"
        :class="{
          'self-start': item.type === 'video',
          'self-end': item.type === 'image',
        }"
      >
        <Tooltip tooltip="Выбрать еще с устройства">
          <UIButton
            size="s"
            class="rounded-xl"
            @click="emits('openFileFromDeviceDialog')"
          >
            <ITablerPlus />
          </UIButton>
        </Tooltip>

        <Tooltip tooltip="Вставить еще из буфера">
          <UIButton
            size="s"
            class="rounded-xl"
            @click="emits('openFileFromClipboardDialog')"
          >
            <ITablerClipboard />
          </UIButton>
        </Tooltip>
      </Flex>

      <Tooltip v-if="!state.loading" tooltip="Удалить">
        <UIButton
          size="s"
          class="absolute top-0 right-0 m-2 !bg-red-500 hover:!bg-red-700 rounded-xl sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity pointer-events-auto"
          @click="emits('remove', item.id as string)"
        >
          <ITablerTrash />
        </UIButton>
      </Tooltip>
    </Flex>
  </div>
</template>

<script lang="ts" setup>
import type { GalleryItem } from '~/components/editor/nodes/gallery/Gallery.vue'
import type Video from '~/components/global/Video.vue'
import type { StorageMedia } from '~/types'

const props = defineProps<{
  item: GalleryItem
  parent: HTMLElement | undefined
  isSingle: boolean
  isGallery: boolean
  isDraggable: boolean
}>()

const emits = defineEmits<{
  remove: [string]
  openFileFromDeviceDialog: any
  openFileFromClipboardDialog: any
  uploaded: [GalleryItem]
}>()

const { $api } = useNuxtApp()

const videoRef = ref<InstanceType<typeof Video>>()

watch(
  () => props.isSingle,
  (newV, oldV) => {
    if (newV !== oldV && videoRef.value?.isPlaying) {
      videoRef.value.isPlaying = false
    }
  }
)

const state = reactive<{
  item: GalleryItem | null
  dragging: boolean
  loading: boolean
}>({
  item: null,
  dragging: false,
  loading: false,
})

function onTouch(value: boolean) {
  if (!props.isDraggable) return

  state.dragging = value
}

const { swipeEnabled } = useRootNode()
watch(
  () => state.dragging,
  (v) => (swipeEnabled.value = !v)
)

function updateItem(data: StorageMedia) {
  const { url: src, thumbnail, width, height, description } = data

  emits('uploaded', {
    src,
    thumbnail: thumbnail?.url,
    description,
    width,
    height,
    type: props.item.type,
    media: data,
    uploaded: true,
  })
}

const { errorToastify } = useToasts()

function showError() {
  emits('remove', props.item.id as string)
  errorToastify({ title: 'Ошибка', text: 'Не удалось загрузить файл' })
}

async function upload() {
  try {
    const file = await getFileFromBase64(props.item.src)

    if (!file) {
      showError()
      return
    }

    const data = await $api.uploadMediaByFile(file)

    if (!data) {
      showError()
      return
    }

    updateItem(data)
  } catch (error) {
    showError()
  } finally {
    state.loading = false
  }
}

onMounted(() => {
  if (!props.item.uploaded) {
    state.loading = true
    upload()
  }
})
</script>
