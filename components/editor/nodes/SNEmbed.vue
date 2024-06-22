<template>
  <NodeViewWrapper
    contenteditable="false"
  >
    <Flex
      v-if="!node.attrs.embed"
      center
      class="px-4 py-24 border-2 border-gray-100 rounded-xl"
    >
      <ITablerBrandX class="!size-16 animate-pulse" v-if="node.attrs.type === 'x'" />
    </Flex>

    <SNEmbed v-else :embed="node.attrs.embed" />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import SNEmbed from '~/components/global/embeds/SNEmbed.vue'

const props = defineProps<NodeViewProps>()

onMounted(async () => {
  if (props.node.attrs.url) {
    const { data: embed } = await getEmbed(props.node.attrs.url)
    props.updateAttributes({ url: null, embed })
  }
})
</script>
