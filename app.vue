<template>
  <Header />

  <main class="mx-auto pb-[60px] sm:pb-[unset] w-full max-w-[640px] h-full">
    <NuxtPage />
  </main>

  <LazyEditorDialog />
  <LazyNotifications />
  <LazyLightbox />
</template>

<script lang="ts" setup>
const { getMe } = useUser()
await getMe()
</script>
