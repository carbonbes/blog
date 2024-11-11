<template>
  <Teleport to="#teleports">
    <ToastProvider>
      <Toast v-for="toast in toasts" :key="toast.id" :toast />

      <ToastViewport
        class="fixed inset-0 sm:inset-[unset] sm:top-[60px] sm:right-0 p-4 w-full sm:w-[350px] flex flex-col gap-2 pointer-events-none"
      />
    </ToastProvider>
  </Teleport>
</template>

<script lang="ts" setup>
import Toast from '~/components/global/toasts/Toast.vue'

const { toasts } = useToasts()
</script>
