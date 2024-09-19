<template>
  <Flex col class="bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
    <Flex justifyBetween class="p-5">
      <div
        class="grid grid-rows-[repeat(2,_1fr)] grid-columns-[repeat(2,_minmax(0,_max_-_content))] gap-x-3"
      >
        <a :href="embed.author.url" target="_blank" class="row-[1/2_span] col-[1]">
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
          <a :href="embed.url" target="_blank" class="max-w-fit row-[2_span] col-[2] translate-y-[2px] !no-underline">
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

      <GalleryGrid
        v-if="embed.media"
        :items="embed.media"
      />
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type { SNEmbed } from '~/types'

defineProps<{ embed: SNEmbed }>()
</script>
