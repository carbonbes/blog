<template>
  <Flex col class="p-6 max-w-[680px] min-[680px]:rounded-xl bg-white shadow-sm">
    <ArticleHeader :article class="pb-4" />
    <ArticleContent :article />
  </Flex>
</template>

<script lang="ts" setup>
import type { Article } from '~/types'

defineProps<{
  article: Article
  class?: string | object
}>()
</script>
