<template>
  <Header />
  <main>
    <NuxtPage />
  </main>

  <EditorDialog />
  <Notifications />
</template>

<script lang="ts" setup>
const { getMe } = useMe()
await getMe()
</script>