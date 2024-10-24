<template>
  <Flex col class="relative">
    <ProsemirrorRender
      :node="processedContent"
      :class="[nodesClasses, headingClasses, paragraphClasses, listClasses]"
    />

    <NuxtLink
      v-if="isCard"
      :to="articleURL"
      class="absolute inset-0 -ml-6 w-[calc(100%_+_3rem)] sm:rounded-b-xl"
    />
  </Flex>
</template>

<script lang="ts" setup>
import type { Article } from '~/types'
import Gallery from '~/components/article/nodes/Gallery.vue'
import SNEmbed from '~/components/article/nodes/SNEmbed.vue'
import HorizontalRule from '~/components/article/nodes/HorizontalRule.vue'

const props = defineProps<{
  article: Article
  short?: boolean
  isCard?: boolean
}>()

provideProsemirrorOptions({
  skipUnknown: true,
  types: {
    horizontal_rule: () => HorizontalRule,
    gallery: () => Gallery,
    sn_embed: () => SNEmbed,
  },
})

const processedContent = computed(() => {
  const body = props.article.body?.content.map((rootNode) => {
    const [node] = rootNode.content

    return {
      type: node.type,
      attrs: { ...rootNode.attrs, ...(node.attrs || {}) },
      ...(node.content && { content: node.content }),
    }
  })

  if (props.short) {
    return { type: 'doc', content: body.splice(0, 3) }
  }

  return { type: 'doc', content: body }
})

const nodesClasses =
  'not-first:[&_>_*]:mt-4 not-last:[&_>_*]:mb-4 [&_p>a]:text-blue-500 [&_p>a]:underline'

const headingClasses =
  'not-first:[&_>_h1]:!mt-6 not-first:[&_>_h1]:sm:mt-3 not-first:[&_>_h2]:!mt-6 not-first:[&_>_h2]:sm:mt-3 [&_>_h1]:font-bold [&_>_h2]:font-bold  [&_>_h1]:text-2xl [&_>_h2]:text-xl'

const paragraphClasses = ''

const listClasses =
  '[&_>_ol]:pl-4 [&_>_ul]:pl-4 [&_>_ol]:list-decimal [&_>_ul]:list-disc not-first:[&_ul_>_li]:mt-2 not-first:[&_ol_>_li]:mt-2'

const articleURL = computed(() => getArticleURL(props.article))
</script>
