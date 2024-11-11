<template>
  <ToastRoot
    class="p-4 gap-3 bg-white border border-gray-100 rounded-xl shadow-sm pointer-events-auto data-[state='open']:animate-toast data-[state='closed']:animate-[hide_0.15s] data-[swipe='move']:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe='end']:animate-[toast-swipe-end_0.15s] data-[swipe='cancel']:translate-x-0 data-[swipe='cancel']:duration-150"
    :duration="toast.duration"
    @update:open="onOpen"
    asChild
  >
    <Flex col>
      <Flex itemsCenter class="gap-2">
        <div
          class="rounded-full self-start p-1"
          :class="{
            'bg-green-500': isSuccess,
            'bg-red-500': !isSuccess,
          }"
        >
          <Component :is="icon" class="text-white !w-3 !h-3" />
        </div>

        <ToastTitle v-if="toast.title" class="w-full font-medium break-anywhere">
          {{ toast.title }}
        </ToastTitle>

        <ToastDescription v-if="!toast.title && toast.text" class="w-full">
          {{ toast.text }}
        </ToastDescription>

        <ToastClose class="self-start hover:opacity-50 transition-opacity">
          <ITablerX class="!w-5 !h-5" />
        </ToastClose>
      </Flex>

      <ToastDescription v-if="toast.title && toast.text">{{
        toast.text
      }}</ToastDescription>
    </Flex>
  </ToastRoot>
</template>

<script lang="ts" setup>
import type { Toast } from '~/types'
import Check from '~icons/tabler/check'
import X from '~icons/tabler/X'
import { promiseTimeout } from '@vueuse/core'

const props = defineProps<{ toast: Toast }>()

const isSuccess = computed(() => props.toast.type === 'success')
const icon = computed(() => (isSuccess.value ? Check : X))

const { remove } = useToasts()

async function onOpen(value: boolean) {
  if (!value) {
    await promiseTimeout(150)
    remove(props.toast.id)
  }
}
</script>
