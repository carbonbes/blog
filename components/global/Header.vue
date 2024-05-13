<template>
  <Flex itemsCenter class="sticky top-0 px-6 h-[60px] bg-white shadow z-10">
    <div class="ml-auto gap-2" v-if="isAuthenticated">
      {{ profile?.name }}
      <button @click="logoutMe">Выйти</button>
    </div>
  </Flex>
</template>

<script lang="ts" setup>
const { isAuthenticated, profile, logoutMe } = useMe()
</script>
