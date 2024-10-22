<template>
  <Article :article isCard />
</template>

<script lang="ts" setup>
import type { Article } from '~/types'

defineProps<{
  article: Article
  class?: string | object
}>()
</script>
