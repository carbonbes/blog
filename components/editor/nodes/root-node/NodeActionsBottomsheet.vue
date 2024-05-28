<template>
  <Bottomsheet class="!bg-gray-100" @close="onClose" ref="bottomsheetRef">
    <ScrollArea>
      <SlideTransition :initialIndex="state.view">
        <Flex v-if="state.view === 1" col class="pb-[25vh] !flex gap-4">
          <UIButton
            v-for="(action, i) in actions"
            :key="i"
            variant="secondary"
            size="l"
            class="flex items-center gap-3"
            :class="{ 'text-blue-500': action.active }"
            @click="action.action"
          >
            <Component :is="action.icon" />
            {{ action.label }}
            <ITablerChevronRight v-if="action.additional" class="ml-auto" />
          </UIButton>
        </Flex>

        <Flex v-else col class="pb-[25vh] !flex gap-4">
          ВТОРОЙ ЭКРАН

          <UIButton
            variant="secondary"
            size="l"
            class="flex items-center gap-3"
            @click="state.view = 1"
          >
            <ITablerArrowLeft />
            Назад
          </UIButton>
        </Flex>
      </SlideTransition>
    </ScrollArea>
  </Bottomsheet>
</template>

<script lang="ts" setup>
import type Bottomsheet from '~/components/global/Bottomsheet.vue'
import Pin from '~icons/tabler/pin'
import EyeOff from '~icons/tabler/eye-off'
import Refresh from '~icons/tabler/refresh'

const props = defineProps<{
  updateAttributes: (attributes: Record<string, any>) => void
  nodeIsPinned: boolean
  nodeIsSpoilered: boolean
  nodeType: string
}>()

const emit = defineEmits<{
  close: any
}>()

const state: {
  view: 1 | 2
} = reactive({
  view: 1
})

function onClose() {
  emit('close')
  state.view = 1
}

const actions = computed(() => [
  {
    icon: Pin,
    label: !props.nodeIsPinned ? 'Вывести в карточке' : 'Выводится в карточке',
    active: props.nodeIsPinned,
    action: () => {
      props.updateAttributes({ pin: !props.nodeIsPinned })
      setOpen(false)
    }
  },
  {
    icon: EyeOff,
    label: !props.nodeIsSpoilered ? 'Скрыть' : 'Скрывается',
    active: props.nodeIsSpoilered,
    action: () => {
      props.updateAttributes({ spoiler: !props.nodeIsSpoilered })
      setOpen(false)
    }
  },
  {
    icon: Refresh,
    label: 'Поменять на',
    action: () => {
      state.view = 2
    },
    additional: true
  },
])

const bottomsheetRef = ref<InstanceType<typeof Bottomsheet>>()

function setOpen(value: boolean) {
  bottomsheetRef.value?.setOpen(value)
}

defineExpose({ setOpen })
</script>
