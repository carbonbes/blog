<template>
  <NodeViewWrapper
    contenteditable="false"
  >
    <Flex
      v-if="!node.attrs.tweet"
      center
      class="px-4 py-24 border-2 border-gray-100 rounded-xl"
    >
      <IIconsTwitter class="!size-16 animate-pulse" />
    </Flex>

    <Tweet v-else :tweet="node.attrs.tweet" />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import Tweet from '~/components/global/embeds/Tweet.vue'

const props = defineProps<NodeViewProps>()

onMounted(async () => {
  if (props.node.attrs.tweetUrl) {
    const { data } = await getEmbed(props.node.attrs.tweetUrl)

    props.updateAttributes({ tweetUrl: null, tweet: data })
  }
})
</script>
