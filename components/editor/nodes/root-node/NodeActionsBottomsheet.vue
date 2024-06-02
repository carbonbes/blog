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
import type { Editor } from '@tiptap/core'
import type { NodeType } from '~/types'
import Pin from '~icons/tabler/pin'
import EyeOff from '~icons/tabler/eye-off'
import Refresh from '~icons/tabler/refresh'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import Paragraph from '~icons/tabler/letter-case'
import List from '~icons/tabler/list'
import ListNumbers from '~icons/tabler/list-numbers'

const props = defineProps<{
  updateAttributes: (attributes: Record<string, any>) => void
  changeNodeType: ({ type, level }: { type: NodeType, level?: 1 | 2 }) => void
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

const mainButtons = computed(() => [
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

const changeNodeTypeButtons = computed(() => [
  {
    icon: Heading1,
    label: 'Заголовок 1',
    action: () => {
      props.changeNodeType({ type: 'heading', level: 1 })
      setOpen(false)
    }
  },
  {
    icon: Heading2,
    label: 'Заголовок 2',
    action: () => {
      props.changeNodeType({ type: 'heading', level: 2 })
      setOpen(false)
    }
  },
  {
    icon: Paragraph,
    label: 'Текст',
    action: () => {
      props.changeNodeType({ type: 'paragraph' })
      setOpen(false)
    }
  },
  {
    icon: ListNumbers,
    label: 'Нумерованный список',
    action: () => {
      props.changeNodeType({ type: 'orderedList' })
      setOpen(false)
    }
  },
  {
    icon: List,
    label: 'Маркированный список',
    action: () => {
      props.changeNodeType({ type: 'bulletList' })
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
