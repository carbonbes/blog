<template>
  <Flex
    col
    class="bg-white border-2 border-gray-100 rounded-xl overflow-hidden"
  >
    <Flex justifyBetween class="p-5">
      <div
        class="grid grid-rows-[repeat(2,_1fr)] grid-columns-[repeat(2,_minmax(0,_max_-_content))] gap-x-3"
      >
        <a
          :href="embed.author.url"
          target="_blank"
          class="row-[1/2_span] col-[1] overflow-hidden rounded-full inner-border"
        >
          <Image :src="embed.author.avatar.url" class="size-9" />
        </a>
        <Flex
          itemsCenter
          class="min-w-0 gap-2 row-[1_span] col-[2] leading-[18px] whitespace-nowrap"
        >
          <Flex itemsCenter class="gap-1">
            <a
              :href="embed.author.url"
              target="_blank"
              class="!no-underline !text-[inherit] font-medium text-[15px] overflow-hidden text-ellipsis"
            >
              {{ embed.author.name }}
            </a>
            <div v-if="embed.author.verified" class="bg-blue-500 rounded-full">
              <ITablerCheck class="p-0.5 !size-4 text-white" />
            </div>
          </Flex>
          <a
            :href="embed.author.url"
            class="!no-underline !text-gray-400 text-[15px] overflow-hidden text-ellipsis"
          >
            @{{ embed.author.username }}
          </a>
        </Flex>
        <Tooltip :tooltip="new Date(embed.created_at).toLocaleString()">
          <a
            :href="embed.url"
            target="_blank"
            class="max-w-fit row-[2_span] col-[2] translate-y-[3px] !no-underline"
          >
            <DateTime
              :dateTime="embed.created_at"
              class="text-gray-500 leading-[18px] text-sm"
            />
          </a>
        </Tooltip>
      </div>

      <ITablerBrandX v-if="embed.type === 'x'" class="pl-4 box-content" />
      <IIconsTelegram v-else class="pl-4 box-content" />
    </Flex>

    <Flex col>
      <CollapsibleText
        v-if="embed.text"
        :text="embed.text"
        :maxLength="175"
        class="px-5 pb-5 whitespace-pre-line"
      />

      <Flex v-if="singleImage" center class="bg-gray-100">
        <Image
          :src="singleImage.url"
          :alt="singleImage.alt"
          :originalWidth="singleImage.width"
          :originalHeight="singleImage.height"
          :options="{ quality: 50 }"
          zoomable
          class="w-fit max-h-80"
        />
      </Flex>

      <Video
        v-else-if="singleVideo"
        :src="singleVideo.url"
        :description="singleVideo.alt"
        :thumbnail="singleVideo.thumbnail!.url"
        :originalWidth="singleVideo.width"
        :originalHeight="singleVideo.height"
        autoplay
        controls
        classes="w-full h-80"
      />

      <GalleryGrid v-else-if="gallery" :items="gallery.media" />
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type { SNEmbed } from '~/types'

const props = defineProps<{ embed: SNEmbed }>()

const singleImage = computed(() => {
  if (
    props.embed.media &&
    props.embed.media.length === 1 &&
    getFileTypeFromMimeType(props.embed.media[0].mime_type) === 'image'
  ) {
    const { name, url, width, height, description: alt } = props.embed.media[0]

    return {
      name,
      url,
      alt,
      width,
      height,
    }
  }
})

const singleVideo = computed(() => {
  if (
    props.embed.media &&
    props.embed.media.length === 1 &&
    getFileTypeFromMimeType(props.embed.media[0].mime_type) === 'video'
  ) {
    const {
      url,
      thumbnail,
      width,
      height,
      description: alt,
    } = props.embed.media[0]

    return {
      url,
      alt,
      thumbnail,
      width,
      height,
    }
  }
})

const gallery = computed(() => {
  if (props.embed.media && props.embed.media.length > 1) {
    return {
      media: props.embed.media,
    }
  }
})
</script>
