<template>
  <Header />
  <main>
    <NuxtPage />
  </main>
</template>

<script lang="ts" setup>
const { getMe } = useMe()
await getMe()
</script>