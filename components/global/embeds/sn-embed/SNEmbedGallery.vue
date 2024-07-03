<template>
  <Flex>
    <template v-for="item in items">
      <a
        :href="item.url"
        ref="nofollow"
        target="_blank"
        :data-pswp-src="item.url"
        :data-pswp-video-src="item.type === 'video' ? item.url : undefined"
        :data-pswp-width="item.width"
        :data-pswp-height="item.height"
        data-cropped="true"
        :data-pswp-type="item.type === 'video' ? 'video' : undefined"
      >
        <img
          :src="item.type === 'video' ? item.thumbnail : item.url"
          alt=""
        >
      </a>
    </template>
  </Flex>
</template>

<script lang="ts" setup>
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipeVideoPlugin from 'photoswipe-video-plugin'
import 'photoswipe/style.css'

const props = defineProps<{
  items: {
    url: string
    thumbnail?: string
    width: number
    height: number
    type: 'image' | 'video' | 'gif'
  }[]
}>()
</script>
