<template>
  <Bottomsheet class="!bg-gray-100" ref="bottomsheetRef">
    <ScrollArea>
      <Flex col class="pb-[25vh] !flex gap-4">
        <UIButton
          v-for="(button, i) in buttons"
          :key="i"
          variant="secondary"
          size="l"
          class="flex items-center gap-3"
          @click="button.action"
        >
          <Component :is="button.icon" />
          {{ button.label }}
        </UIButton>
      </Flex>
    </ScrollArea>
  </Bottomsheet>
</template>

<script lang="ts" setup>
import type Bottomsheet from '~/components/global/Bottomsheet.vue'
import Pin from '~icons/tabler/pin'
import EyeOff from '~icons/tabler/eye-off'

const emit = defineEmits<{
  toggleAttribute: ['pin' | 'spoiler']
}>()

const buttons = markRaw([
  {
    icon: Pin,
    label: 'Вывести в карточке',
    action: () => {
      emit('toggleAttribute', 'pin')
      setOpen(false)
    }
  },
  {
    icon: EyeOff,
    label: 'Скрыть',
    action: () => {
      emit('toggleAttribute', 'spoiler')
      setOpen(false)
    }
  },
])

const bottomsheetRef = ref<InstanceType<typeof Bottomsheet>>()

function setOpen(value: boolean) {
  bottomsheetRef.value?.setOpen(value)
}

defineExpose({ setOpen })
</script>
