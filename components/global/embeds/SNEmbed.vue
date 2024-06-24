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
          <p
            class="font-medium text-[15px] overflow-hidden text-ellipsis"
          >
            {{ embed.author.name }}
          </p>
          <p
            class="text-gray-400 text-[15px] overflow-hidden text-ellipsis"
          >
            @{{ embed.author.tag }}
          </p>
        </Flex>
        <DateTime
          :dateTime="embed.published!"
          class="row-[2_span] col-[2] text-gray-500 leading-[18px] text-sm translate-y-[2px]"
        />
      </div>

      <ITablerBrandX class="pl-4 box-content" v-if="embed.type === 'x'" />
    </Flex>

    <Flex col>
      <p v-if="embed.text" class="px-5 pb-5 whitespace-pre-line">{{ embed.text }}</p>

      <Image
        v-if="embed.media?.length === 1 && embed.media[0].type === 'photo'"
        :src="embed.media[0].url"
        size="max-h-80"
        zoomable
        class="bg-gray-100/50 flex justify-center"
      />

      <Gallery
        v-else-if="embed.media?.length > 1 "
        :images="embed.media"
      />

      <Video
        v-else-if="embed.media?.length === 1 && ['video', 'animated_gif'].includes(embed.media[0].type)"
        :src="embed.media[0].url"
        :thumbnail="embed.media[0].thumbnail"
        autoplay
        :loop="embed.media[0].type === 'animated_gif'"
        :controls="embed.media[0].type === 'video'"
        size="w-full max-h-80"
        type="default"
        class="bg-gray-100/50 flex justify-center"
      />
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type { SocialNetworkEmbed } from '~/types'

const props = defineProps<{ embed: SocialNetworkEmbed }>()
</script>
