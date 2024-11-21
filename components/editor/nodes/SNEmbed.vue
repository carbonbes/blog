<template>
  <NodeViewWrapper
    contenteditable="false"
    data-prevent-focus="true"
    class="user-select-all"
  >
    <Flex
      v-if="!node.attrs.embed"
      center
      class="px-4 py-24 border-2 border-gray-100 rounded-xl"
    >
      <ITablerBrandX
        class="!size-16 animate-pulse"
        v-if="node.attrs.type === 'x'"
      />
      <IIconsTelegram class="!size-16 animate-pulse" v-else />
    </Flex>

    <SNEmbed v-else :embed="node.attrs.embed" />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import SNEmbed from '~/components/global/SNEmbed.vue'

const props = defineProps<NodeViewProps>()

const { $api } = useNuxtApp()

const { errorToastify } = useToasts()

onMounted(async () => {
  if (props.node.attrs.url) {
    try {
      const embed =
        props.node.attrs.type === 'telegram'
          ? await $api.getTelegramEmbed(props.node.attrs.url)
          : await $api.getXEmbed(props.node.attrs.url)

      props.updateAttributes({ url: null, embed })
    } catch (error: any) {
      props.deleteNode()
      errorToastify({ text: error.data.message })
    }
  }
})
</script>
