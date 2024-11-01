<template>
  <Header />

  <main
    class="mx-auto pb-[var(--header-height)] sm:pb-[unset] sm:pt-[var(--header-height)] w-full max-w-[640px] h-full"
  >
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
