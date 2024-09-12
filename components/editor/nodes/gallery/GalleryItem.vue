<template>
  <div class="relative" :class="{ 'w-full': isSingle }">
    <Tooltip v-if="isGallery" tooltip="Удалить">
      <button
        class="absolute top-0 left-full -translate-y-1/2 -translate-x-1/2 p-1 bg-white border border-gray-200/75 rounded-full group/remove-btn z-[1]"
        @click="emits('remove')"
      >
        <ITablerX
          class="!size-3 group-hover/remove-btn:text-red-500 transition-colors"
        />
      </button>
    </Tooltip>

    <Tooltip v-if="isGallery" tooltip="Перетащить">
      <button
        class="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-white border border-gray-200/75 rounded-full group/remove-btn z-[1]"
        id="gallery-node-item-grip"
        @touchstart="swipeEnabled = false"
        @touchend="swipeEnabled = true"
      >
        <ITablerGripHorizontal
          class="!size-3 group-hover/remove-btn:text-blue-500 transition-colors"
        />
      </button>
    </Tooltip>

    <Flex
      :center="isSingle"
      class="bg-gray-100 rounded-xl overflow-hidden after:absolute after:inset-0 after:shadow-[inner_0_0_0_1px_red] after:rounded-xl after:pointer-events-none"
      :class="{ 'pointer-events-none opacity-50': state.loading }"
    >
      <Image
        v-if="['image', 'gif'].includes(item.type)"
        :src="item.src"
        :alt="item.alt"
        :originalWidth="item.width"
        :originalHeight="item.height"
        :parent
        :zoomable="isSingle"
        :lightboxItem="isGallery"
        :class="{
          'max-h-80': isSingle,
          'w-20 h-20 object-cover': isGallery
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
        :zoomable="isSingle"
        :lightboxItem="isGallery"
        :size="{
          'w-full aspect-video': isSingle,
          'w-20 h-20': isGallery
        }"
      />
    </Flex>

    <Flex
      v-if="isSingle"
      class="absolute left-0 bottom-0 p-2 w-full"
    >
      <Flex class="gap-2">
        <Tooltip tooltip="Выбрать еще с устройства">
          <UIButton
            size="s"
            @click="emits('openFileFromDeviceDialog')"
          >
            <ITablerPlus />
          </UIButton>
        </Tooltip>

        <Tooltip tooltip="Вставить еще из ссылки">
          <UIButton
            size="s"
            @click="emits('openFileFromUrlDialog')"
          >
            <ITablerLink />
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
  openFileFromUrlDialog: any
  loaded: [Item]
}>()

const { swipeEnabled } = useRootNode()

const state = reactive<{
  item: Item | null
  loading: boolean
}>({
  item: null,
  loading: false
})

function upload(file: File) {

}
</script>
