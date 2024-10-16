<template>
  <Flex
    itemsCenter
    class="sticky bottom-0 sm:top-0 sm:bottom-[unset] w-full px-6 h-[60px] bg-white border-t-2 sm:border-t-0 sm:border-b-2 order-1 sm:order-[-1]"
  >
    <Flex itemsCenter class="ml-auto gap-2" v-if="isAuthenticated">
      {{ user?.name }}
      <button
        class="p-1 bg-gray-200 rounded-lg text-sm hover:opacity-50"
        @click="logoutMe"
      >
        Выйти
      </button>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
const { isAuthenticated, user, logoutMe } = useMe()
</script>
