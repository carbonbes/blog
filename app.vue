<template>
  <Header />
  <main class="mx-auto w-full max-w-[680px]">
    <NuxtPage />
  </main>

  <LazyEditorDialog />
  <LazyNotifications />
  <LazyLightbox />
</template>

<script lang="ts" setup>
const { getMe } = useMe()
await getMe()
</script>