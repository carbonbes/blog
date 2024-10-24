<template>
  <HorizontalRule />
</template>

<script lang="ts" setup>
import HorizontalRule from '~/components/global/HorizontalRule.vue'
import type { HorizontalRuleNode } from '~/schema/articleBodySchema'

const props = defineProps<{
  mark?: number
  node: HorizontalRuleNode
}>()
</script>
