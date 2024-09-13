<template>
  <div class="relative" :class="{ 'w-full': isSingle }">
    <template v-if="isGallery && !state.loading">
      <Tooltip tooltip="Удалить">
        <button
          class="absolute top-0 left-full -translate-y-1/2 -translate-x-1/2 p-1 bg-white border border-gray-200/75 rounded-full group/remove-btn z-[1]"
          @click="emits('remove')"
        >
          <ITablerX
            class="!size-3 group-hover/remove-btn:text-red-500 transition-colors"
          />
        </button>
      </Tooltip>

      <Tooltip tooltip="Перетащить">
        <button
          class="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-white border border-gray-200/75 rounded-full group/remove-btn z-[1]"
          id="gallery-node-item-grip"
          @touchstart="swipeEnabled = false"
          @touchend="swipeEnabled = true"
          @touchcancel="swipeEnabled = true"
        >
          <ITablerGripHorizontal
            class="!size-3 group-hover/remove-btn:text-blue-500 transition-colors"
          />
        </button>
      </Tooltip>
    </template>

    <Flex
      :center="isSingle"
      class="bg-gray-100 rounded-xl overflow-hidden after:absolute after:inset-0 after:shadow-[inner_0_0_0_1px_red] after:rounded-xl after:pointer-events-none"
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
          <UIButton size="s" @click="emits('openFileFromDeviceDialog')">
            <ITablerPlus />
          </UIButton>
        </Tooltip>

        <Tooltip tooltip="Вставить еще из буфера">
          <UIButton size="s" @click="emits('openFileFromClipboardDialog')">
            <ITablerClipboard />
          </UIButton>
        </Tooltip>
      </Flex>
    </Flex>

    <Tooltip v-if="isSingle && !state.loading" tooltip="Удалить">
      <UIButton
        size="s"
        class="absolute top-0 right-0 m-2 !bg-red-500 hover:!bg-red-700"
        @click="emits('remove')"
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
  isSingle?: boolean
  isGallery?: boolean
}>()

const emits = defineEmits<{
  remove: any
  openFileFromDeviceDialog: any
  openFileFromClipboardDialog: any
  loaded: [Item]
}>()

const { swipeEnabled } = useRootNode()
const { errorNotify } = useNotifications()

const state = reactive<{
  item: Item | null
  loading: boolean
}>({
  item: null,
  loading: false,
})

function updateItem(data: UploadApiResponse) {
  const { secure_url: src, width, height } = data

  emits('loaded', {
    src,
    alt: '',
    thumbnail: src,
    width,
    height,
    type: props.item.type,
    uploaded: true,
  })
}

function showError() {
  emits('remove')
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
