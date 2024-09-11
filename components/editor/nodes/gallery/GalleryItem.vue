<template>
  <div class="relative" :class="{ 'w-full': isSingle }">
    <Tooltip v-if="isGallery" tooltip="Удалить">
      <button
        class="absolute top-[-10px] right-[-10px] p-1 bg-white border border-gray-100 rounded-full group/remove-btn z-[1]"
      >
        <ITablerX
          class="!size-3 group-hover/remove-btn:text-red-500 transition-colors"
        />
      </button>
    </Tooltip>

    <Flex
      :center="isSingle"
      class="bg-gray-100 rounded-xl overflow-hidden after:absolute after:inset-0 after:shadow-[0,0,0,1px_rgba(0,0,0,0.1)] after:rounded-xl after:pointer-events-none"
    >
      <Image
        v-if="['image', 'gif'].includes(item.type)"
        :src="item.src"
        :alt="item.alt"
        :originalWidth="item.width"
        :originalHeight="item.height"
        :zoomable="isSingle"
        :lightboxItem="isGallery"
        :parent
        :class="{
          'max-h-80': isSingle,
          'w-20 h-20 object-cover': isGallery
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

    <Tooltip v-if="isSingle" tooltip="Удалить">
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
  isSingle?: boolean
  isGallery?: boolean
  parent: HTMLElement | undefined
}>()

const emits = defineEmits<{
  remove: any
  openFileFromDeviceDialog: any
  openFileFromUrlDialog: any
}>()
</script>
