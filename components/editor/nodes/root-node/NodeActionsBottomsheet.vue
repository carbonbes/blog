<template>
  <BottomSheet class="!bg-gray-100 after:!bg-gray-100" @close="onClose" ref="bottomsheetRef">
    <template #header>
      <FadeInOpacityTransition>
        <button v-if="state.view === 2" @click="state.view = 1">
          <ITablerArrowLeft />
        </button>
      </FadeInOpacityTransition>
    </template>

    <SlideTransition :initialIndex="state.view">
      <Flex v-if="state.view === 1" col class="pb-[25vh] !flex gap-4">
        <UIButton
          v-for="(button, i) in mainButtons"
          :key="i"
          variant="secondary"
          size="l"
          class="flex items-center gap-3"
          :class="{ 'text-blue-500': button.active }"
          @click="button.action"
        >
          <Component :is="button.icon" />
          {{ button.label }}
          <ITablerChevronRight v-if="button.additional" class="ml-auto" />
        </UIButton>
      </Flex>

      <Flex v-else col class="pb-[25vh] !flex gap-4">
        <UIButton
          v-for="(button, i) in changeNodeTypeButtons"
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
    </SlideTransition>
  </BottomSheet>
</template>

<script lang="ts" setup>
import type BottomSheet from '~/components/global/BottomSheet.vue'
import type { HeadingLevel, NodeType } from '~/types'
import Pin from '~icons/tabler/pin'
import EyeOff from '~icons/tabler/eye-off'
import Refresh from '~icons/tabler/refresh'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import Paragraph from '~icons/tabler/letter-case'
import List from '~icons/tabler/list'
import ListNumbers from '~icons/tabler/list-numbers'

const props = defineProps<{
  nodeIsPinned: boolean
  nodeIsSpoilered: boolean
  nodeType: NodeType
}>()

const emit = defineEmits<{
  close: any
  changeNodeType: [{ type: NodeType, level?: HeadingLevel }]
  toggleAttribute: [attr: 'pin' | 'spoiler']
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

const mainButtons = computed(() => [
  {
    icon: Pin,
    label: !props.nodeIsPinned ? 'Вывести в карточке' : 'Выводится в карточке',
    active: props.nodeIsPinned,
    action: () => {
      emit('toggleAttribute', 'pin')
      setOpen(false)
    }
  },
  {
    icon: EyeOff,
    label: !props.nodeIsSpoilered ? 'Скрыть' : 'Скрывается',
    active: props.nodeIsSpoilered,
    action: () => {
      emit('toggleAttribute', 'spoiler')
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

const changeNodeTypeButtons = computed(() => [
  {
    icon: Heading1,
    label: 'Заголовок 1',
    action: () => {
      emit('changeNodeType', { type: 'heading', level: 1 })
      setOpen(false)
    }
  },
  {
    icon: Heading2,
    label: 'Заголовок 2',
    action: () => {
      emit('changeNodeType', { type: 'heading', level: 2 })
      setOpen(false)
    }
  },
  {
    icon: Paragraph,
    label: 'Текст',
    action: () => {
      emit('changeNodeType', { type: 'paragraph' })
      setOpen(false)
    }
  },
  {
    icon: ListNumbers,
    label: 'Нумерованный список',
    action: () => {
      emit('changeNodeType', { type: 'orderedList' })
      setOpen(false)
    }
  },
  {
    icon: List,
    label: 'Маркированный список',
    action: () => {
      emit('changeNodeType', { type: 'bulletList' })
      setOpen(false)
    }
  },
])

const bottomsheetRef = ref<InstanceType<typeof BottomSheet>>()

function setOpen(value: boolean) {
  bottomsheetRef.value?.setOpen(value)
}

defineExpose({ setOpen })
</script>
