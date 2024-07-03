<template>
  <Flex col class="bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
    <Flex justifyBetween class="p-5">
      <div
        class="grid grid-rows-[repeat(2,_1fr)] grid-columns-[repeat(2,_minmax(0,_max_-_content))] gap-x-3"
      >
        <Image
          :src="embed.author.avatar!"
          size="w-full"
          rounded="rounded-full"
          class="size-9 row-[1/2_span] col-[1]"
        />
        <Flex itemsCenter class="min-w-0 gap-2 row-[1_span] col-[2] leading-[18px] whitespace-nowrap">
          <a
            :href="`https://x.com/${embed.author.username}`"
            target="_blank"
            class="!no-underline !text-[inherit] font-medium text-[15px] overflow-hidden text-ellipsis"
          >
            {{ embed.author.name }}
          </a>
          <a
            :href="`https://x.com/${embed.author.username}`"
            class="!no-underline !text-gray-400 text-[15px] overflow-hidden text-ellipsis"
          >
            @{{ embed.author.username }}
          </a>
        </Flex>
        <Tooltip :tooltip="new Date(embed.published).toLocaleString()">
          <DateTime
            :dateTime="embed.published!"
            class="max-w-fit row-[2_span] col-[2] text-gray-500 leading-[18px] text-sm translate-y-[2px]"
          />
        </Tooltip>
      </div>

      <ITablerBrandX class="pl-4 box-content" v-if="embed.type === 'x'" />
    </Flex>

    <Flex col>
      <p v-if="embed.text" class="px-5 pb-5 whitespace-pre-line">
        {{ embed.text }}
      </p>

      <Image
        v-if="embed.media && isSingleImg"
        :src="embed.media[0].url"
        size="max-h-80"
        zoomable
        class="bg-gray-100/50 flex justify-center"
      />

      <Video
        v-else-if="embed.media && isSingleVideo"
        :src="embed.media[0].url"
        :thumbnail="embed.media[0].thumbnail"
        autoplay
        :loop="embed.media[0].type === 'gif'"
        :controls="embed.media[0].type === 'video'"
        playsInline
        size="w-full max-h-80"
        :type="embed.media[0].type"
        class="bg-gray-100/50 flex justify-center"
      />

      <SNEmbedGallery
        v-else-if="embed.media && embed.media?.length > 1"
        :items="embed.media"
      />
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type { SNEmbed } from '~/types'

const props = defineProps<{ embed: SNEmbed }>()

const isSingleImg = computed(() => props.embed.media && props.embed.media.length === 1 && props.embed.media[0].type === 'image')
const isSingleVideo = computed(() => props.embed.media && props.embed.media.length === 1 && ['video', 'gif'].includes(props.embed.media[0].type))
</script>
