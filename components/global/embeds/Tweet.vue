<template>
  <Flex col class="p-4 sm:p-6 gap-4 border-2 border-gray-100 rounded-xl">
    <Flex justifyBetween>
      <div
        class="grid grid-rows-[repeat(2,_1fr)] grid-columns-[repeat(2,_minmax(0,_max_-_content))] gap-x-2"
      >
        <Image
          :src="tweet?.author.avatar!"
          size="w-full h-full"
          rounded="rounded-full"
          class="w-fit row-[1/2_span] col-[1]"
        />
        <Flex itemsCenter class="gap-2 row-[1_span] col-[2]">
          <p class="font-medium">{{ tweet?.author.name }}</p>
          <p class="text-gray-400 text-[15px]">@{{ tweet?.author.tag }}</p>
        </Flex>
        <DateTime :dateTime="tweet?.published!" class="row-[2_span] col-[2] text-gray-500 text-[15px]" />
      </div>

      <IIconsTwitter />
    </Flex>

    <Flex col class="gap-2">
      <p class="whitespace-pre-line">{{ tweet?.text }}</p>

      <Image
        :src="tweet?.media![0].url!"
        size="max-h-80"
        zoomable
        rounded="rounded-xl"
        class="bg-gray-100 flex justify-center"
        v-if="tweet?.media"
      />
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type { TweetEmbed } from '~/types'

const props = defineProps<{ tweetUrl?: string, tweet?: TweetEmbed }>()
</script>
