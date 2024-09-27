<template>
  <Flex col class="bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
    <Flex justifyBetween class="p-5">
      <div
        class="grid grid-rows-[repeat(2,_1fr)] grid-columns-[repeat(2,_minmax(0,_max_-_content))] gap-x-3"
      >
        <a
          :href="embed.author.url"
          target="_blank"
          class="row-[1/2_span] col-[1]"
        >
          <Image
            :src="embed.author.avatar!"
            size="w-full"
            rounded="rounded-full"
            class="size-9"
          />
        </a>
        <Flex itemsCenter class="min-w-0 gap-2 row-[1_span] col-[2] leading-[18px] whitespace-nowrap">
          <a
            :href="embed.author.url"
            target="_blank"
            class="!no-underline !text-[inherit] font-medium text-[15px] overflow-hidden text-ellipsis"
          >
            {{ embed.author.name }}
          </a>
          <a
            :href="embed.author.url"
            class="!no-underline !text-gray-400 text-[15px] overflow-hidden text-ellipsis"
          >
            @{{ embed.author.username }}
          </a>
        </Flex>
        <Tooltip :tooltip="new Date(embed.published).toLocaleString()">
          <a
            :href="embed.url"
            target="_blank"
            class="max-w-fit row-[2_span] col-[2] translate-y-[2px] !no-underline"
          >
            <DateTime
              :dateTime="embed.published!"
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

      <Flex
        v-if="singleImage"
        center
        class="bg-gray-100"
      >
        <Image
          :src="singleImage.url"
          :alt="singleImage.alt"
          :originalWidth="singleImage.width"
          :originalHeight="singleImage.height"
          zoomable
          size="w-fit max-h-80"
        />
      </Flex>

      <Video
        v-else-if="singleVideo"
        :src="singleVideo.url"
        :alt="singleVideo.alt"
        :thumbnail="singleVideo.thumbnail"
        :originalWidth="singleVideo.width"
        :originalHeight="singleVideo.height"
        autoplay
        controls
        size="w-full h-80"
      />

      <GalleryGrid
        v-else-if="gallery"
        :items="gallery.media"
      />
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type { SNEmbed } from '~/types'

const props = defineProps<{ embed: SNEmbed }>()

const singleImage = computed(() => {
  if (props.embed.media && props.embed.media.length === 1 && ['image', 'gif'].includes(props.embed.media[0].type)) {
    return {
      url: props.embed.media[0].url,
      alt: props.embed.media[0].alt,
      width: props.embed.media[0].width,
      height: props.embed.media[0].height
    }
  }
})

const singleVideo = computed(() => {
  if (props.embed.media && props.embed.media.length === 1 && props.embed.media[0].type === 'video') {
    return {
      url: props.embed.media[0].url,
      alt: props.embed.media[0].alt,
      thumbnail: props.embed.media[0].thumbnail,
      width: props.embed.media[0].width,
      height: props.embed.media[0].height
    }
  }
})

const gallery = computed(() => {
  if (props.embed.media && props.embed.media.length > 1) {
    return {
      media: props.embed.media
    }
  }
})
</script>
