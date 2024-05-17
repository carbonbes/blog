<template>
  <Flex
    itemsCenter
    :class="notificationClasses"
    @mouseenter="state.isHovered = true"
    @mouseleave="mouseLeaveHandler"
  >
    <div :class="iconClasses">
      <Component :is="icon" class="text-white !w-3 !h-3" />
    </div>

    <Flex col class="gap-2">
      <p class="font-medium" v-if="notification.title">{{ notification.title }}</p>
      <p>{{ notification.text }}</p>
    </Flex>

    <button
      class="ml-2 self-start hover:opacity-50 transition-opacity"
      @click="remove(props.notification.id)"
    >
      <ITablerX class="!w-5 !h-5" />
    </button>
  </Flex>
</template>

<script lang="ts" setup>
import type { Notification } from '~/types'
import { promiseTimeout } from '@vueuse/core'
import Check from '~icons/tabler/check'
import X from '~icons/tabler/X'

const props = defineProps<{ notification: Notification }>()

const isSuccess = computed(() => props.notification.type === 'success')

const notificationClasses = computed(() => ({
  'relative p-4 gap-3 border-2 rounded-xl pointer-events-auto overflow-hidden': true,
  'bg-green-100 border-green-200': isSuccess.value,
  'bg-red-100 border-red-200': !isSuccess.value
}))

const icon = computed(() => isSuccess.value ? Check : X)

const iconClasses = computed(() => ({
  'rounded-full self-start p-1': true,
  'bg-green-500': isSuccess.value,
  'bg-red-500': !isSuccess.value,
}))

const { remove } = useNotifications()

const state: {
  isHovered: boolean
  timerIsExpired: boolean
} = reactive({
  isHovered: false,
  timerIsExpired: false
})

function mouseLeaveHandler() {
  state.isHovered = false

  if (state.timerIsExpired) {
    remove(props.notification.id)
  }
}

onMounted(async () => {
  await promiseTimeout(props.notification.duration!)

  state.timerIsExpired = true

  if (state.isHovered) return

  remove(props.notification.id)
})
</script>