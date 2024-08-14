<template>
  <Header />
  <main>
    <NuxtPage />
  </main>

  <LazyEditorDialog />
  <Notifications />
  <LazyLightbox />
</template>

<script lang="ts" setup>
const { getMe } = useMe()
await getMe()
</script>