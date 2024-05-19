<template>
  <Flex itemsCenter :class="headerClasses">
    <Flex itemsCenter class="ml-auto gap-2" v-if="isAuthenticated">
      {{ profile?.name }}
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
const { isAuthenticated, profile, logoutMe } = useMe()

const headerClasses = computed(() =>
  'fixed sm:sticky bottom-0 sm:bottom-[unset] sm:top-0 w-full px-6 h-[60px] bg-white border-t-2 sm:border-t-0 sm:border-b-2 order-1 sm:order-[-1]'
)
</script>
