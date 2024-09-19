<template>
  <div
    class="relative"
    :class="{ 'w-full': isSingle }"
    @touchstart="onTouch(true)"
    @touchend="onTouch(false)"
  >
    <template v-if="isGallery && !state.loading">
      <Tooltip tooltip="Удалить">
        <button
          class="absolute top-0 left-full -translate-y-1/2 -translate-x-1/2 p-1 bg-white border border-gray-200/75 rounded-full group/remove-btn z-[1]"
          @click="emits('remove', item.id as string)"
        >
          <ITablerX
            class="!size-3 group-hover/remove-btn:text-red-500 transition-colors"
          />
        </button>
      </Tooltip>
    </template>

    <Flex
      :center="isSingle"
      class="bg-gray-100 rounded-xl overflow-hidden"
      :class="{ 'inner-border': isGallery }"
    >
      <Image
        v-if="['image', 'gif'].includes(item.type)"
        :src="item.src"
        :alt="item.alt"
        :originalWidth="item.width"
        :originalHeight="item.height"
        :parent
        :zoomable="isSingle && item.uploaded"
        :lightboxItem="isGallery && item.uploaded"
        :class="{
          'pointer-events-none opacity-50': state.loading,
          'max-h-80': isSingle,
          'w-20 h-20 object-cover': isGallery,
        }"
      />

      <Video
        v-else-if="item.type === 'video'"
        :src="item.src"
        :alt="item.alt"
        :thumbnail="item.thumbnail"
        :originalWidth="item.width"
        :originalHeight="item.height"
        :parent
        :zoomable="isSingle && item.uploaded"
        :lightboxItem="isGallery && item.uploaded"
        :size="{
          'pointer-events-none opacity-50': state.loading,
          'w-full aspect-video': isSingle,
          'w-20 h-20': isGallery,
        }"
      />

      <Flex v-if="!item.uploaded" center class="absolute inset-0">
        <Loader color="!bg-black" />
      </Flex>
    </Flex>

    <Flex v-if="isSingle" class="absolute left-0 bottom-0 p-2 w-full">
      <Flex class="gap-2">
        <Tooltip tooltip="Выбрать еще с устройства">
          <UIButton size="s" class="rounded-xl" @click="emits('openFileFromDeviceDialog')">
            <ITablerPlus />
          </UIButton>
        </Tooltip>

        <Tooltip tooltip="Вставить еще из буфера">
          <UIButton size="s" class="rounded-xl" @click="emits('openFileFromClipboardDialog')">
            <ITablerClipboard />
          </UIButton>
        </Tooltip>
      </Flex>
    </Flex>

    <Tooltip v-if="isSingle && !state.loading" tooltip="Удалить">
      <UIButton
        size="s"
        class="absolute top-0 right-0 m-2 !bg-red-500 hover:!bg-red-700 rounded-xl"
        @click="emits('remove', item.id as string)"
      >
        <ITablerTrash />
      </UIButton>
    </Tooltip>
  </div>
</template>

<script lang="ts" setup>
import type { UploadApiResponse } from 'cloudinary'
import type { Item } from '~/components/editor/nodes/gallery/Gallery.vue'

const props = defineProps<{
  item: Item
  parent: HTMLElement | undefined
  isSingle: boolean
  isGallery: boolean
  isDraggable: boolean
}>()

const emits = defineEmits<{
  remove: [string]
  openFileFromDeviceDialog: any
  openFileFromClipboardDialog: any
  uploaded: [Item]
}>()

const state = reactive<{
  item: Item | null
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
watch(() => state.dragging, (v) => swipeEnabled.value = !v)

function updateItem(data: UploadApiResponse) {
  const { secure_url: src, public_id, width, height, format } = data

  emits('uploaded', {
    src,
    alt: '',
    thumbnail: props.item.type === 'video'
      ? `https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/${public_id}.${format}`
      : undefined,
    width,
    height,
    type: props.item.type,
    uploaded: true,
  })
}

const { errorNotify } = useNotifications()

function showError() {
  emits('remove', props.item.id as string)
  errorNotify({ title: 'Ошибка', text: 'Не удалось загрузить файл' })
}

async function upload() {
  const file = await getFileFromBase64(props.item.src)

  try {
    const { data } = await uploadMediaByFile(file)

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
