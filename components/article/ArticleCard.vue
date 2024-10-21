<template>
  <Flex col class="p-6 min-[640px]:rounded-xl bg-white shadow-sm overflow-hidden">
    <ArticleHeader :article class="pb-4" />
    <ArticleContent :article :short />
  </Flex>
</template>

<script lang="ts" setup>
import type { Article } from '~/types'

withDefaults(
  defineProps<{
    article: Article
    short?: boolean
    class?: string | object
  }>(),
  { short: false }
)
</script>
