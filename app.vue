<template>
  <Header />
  <main>
    <NuxtPage />
  </main>

  <EditorDialog />
  <Notifications />
  <Lightbox />
</template>

<script lang="ts" setup>
const { getMe } = useMe()
await getMe()
</script>