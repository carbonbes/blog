<template>
  <Flex col justifyCenter class="py-8 w-full gap-4">
    <h1 class="px-6 text-lg font-medium">Мои записи</h1>

    <NuxtPage />
  </Flex>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})
</script>
