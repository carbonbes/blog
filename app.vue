<template>
  <Header />
  <main>
    <NuxtPage />
  </main>

  <Notifications />
</template>

<script lang="ts" setup>
const { getMe } = useMe()
await getMe()
</script>