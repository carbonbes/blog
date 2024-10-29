<template>
  <Flex
    tag="article"
    col
    class="p-6 min-[640px]:rounded-xl bg-white shadow-sm overflow-hidden"
    :class="{ 'pb-0': lastNodeIsMedia }"
  >
    <ArticleHeader :article class="pb-4" />
    <ArticleContent :article :short="isCard" :isCard />
  </Flex>
</template>

<script lang="ts" setup>
import type { Article } from '~/types'

const props = withDefaults(
  defineProps<{
    article: Article
    isCard?: boolean
    class?: string | object
  }>(),
  { isCard: false }
)

const lastNodeIsMedia = computed(() => {
  if (!props.isCard) return false

  const body = props.article.body?.content
    .map((rootNode) => {
      const [node] = rootNode.content

      return {
        type: node.type,
        attrs: { ...rootNode.attrs, ...(node.attrs || {}) },
        ...(node.content && { content: node.content }),
      }
    })
    .splice(0, 3)

  return body[body.length - 1].type === 'gallery'
})
</script>
