<template>
  <Teleport to="body">
    <Flex col :class="notificationsWrapperClasses">
      <TransitionGroup
        enter-active-class="animate-notification"
        leave-active-class="absolute transition-opacity"
        leave-to-class="opacity-0"
        move-class="transition"
      >
        <Notification
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
        />
      </TransitionGroup>
    </Flex>
  </Teleport>
</template>

<script lang="ts" setup>
import Notification from '~/components/notifications/Notification.vue'

const { notifications } = useNotifications()

const notificationsWrapperClasses = computed(() => 'fixed inset-0 sm:inset-[unset] sm:top-[60px] sm:right-0 p-4 w-full sm:w-auto sm:max-w-sm gap-4 overflow-hidden pointer-events-none z-20')
</script>
