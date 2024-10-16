<template>
  <Flex class="gap-4">
    <p class="font-medium">{{ article.author.name }}</p>
    <DateTime :dateTime="article.created_at" class="text-gray-500" />
  </Flex>
</template>

<script lang="ts" setup>
import type { Article } from '~/types'

defineProps<{
  article: Article
}>()
</script>
