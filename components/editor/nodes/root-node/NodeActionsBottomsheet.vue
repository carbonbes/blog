<template>
  <BottomSheet
    class="top-full !bg-gray-100 after:!bg-gray-100"
    contentClass="relative overflow-x-hidden"
    withSlideTransition
    :slideTransitionIndex="state.view"
    @onOpen="(value) => emit('onOpen', value)"
    @close="onClose"
    ref="bottomsheetRef"
  >
    <template #footer>
      <FadeInOpacityTransition>
        <UIButton
          v-if="state.view === 2"
          size="l"
          class="w-full flex items-center justify-center gap-3 !rounded-2xl !shadow"
          @click="state.view = 1"
        >
          Назад
        </UIButton>
      </FadeInOpacityTransition>
    </template>

    <Flex v-if="state.view === 1" col class="w-full pb-[25%] !flex gap-4">
      <UIButton
        v-for="(button, i) in buttons"
        :key="i"
        variant="secondary"
        size="l"
        class="flex items-center gap-3 !rounded-2xl !shadow"
        :class="[{ 'text-blue-500': button.active }]"
        @click="button.action"
        :disabled="button.disabled"
      >
        <Component :is="button.icon" />
        {{ button.label }}
        <ITablerChevronRight v-if="button.additional" class="ml-auto" />
      </UIButton>
    </Flex>

    <Flex v-else col class="w-full pb-[25%] !flex gap-4">
      <UIButton
        v-for="(button, i) in changeNodeTypeButtons"
        :key="i"
        variant="secondary"
        size="l"
        class="flex items-center gap-3 !rounded-2xl !shadow"
        @click="button.action"
      >
        <Component :is="button.icon" />
        {{ button.label }}
      </UIButton>
    </Flex>
  </BottomSheet>
</template>

<script lang="ts" setup>
import type BottomSheet from '~/components/global/BottomSheet.vue'
import type { HeadingLevel, NodeType } from '~/types'
import Pin from '~icons/tabler/pin'
import EyeOff from '~icons/tabler/eye-off'
import ArrowUp from '~icons/tabler/arrow-up'
import ArrowDown from '~icons/tabler/arrow-down'
import Refresh from '~icons/tabler/refresh'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import Paragraph from '~icons/tabler/letter-case'
import List from '~icons/tabler/list'
import ListNumbers from '~icons/tabler/list-numbers'
import Trash from '~icons/tabler/trash'

const emit = defineEmits<{
  onOpen: [boolean]
  moveNode: [direction: 'up' | 'down']
  toggleAttribute: [attr: 'pin' | 'spoiler']
  changeNodeType: [{ type: NodeType, level?: HeadingLevel }]
  removeNode: [void]
}>()

const { selectedNodeAttrs, selectedNodeNeighbors } = useEditor()

const state = reactive({
  view: 1
})

function onClose() {
  emit('onOpen', false)
  state.view = 1
}

const buttons = computed(() => [
  {
    icon: Pin,
    label: 'Вывести в карточке',
    active: selectedNodeAttrs.value?.pin,
    action: () => {
      emit('toggleAttribute', 'pin')
      setOpen(false)
    }
  },
  {
    icon: EyeOff,
    label: 'Скрыть',
    active: selectedNodeAttrs.value?.spoiler,
    action: () => {
      emit('toggleAttribute', 'spoiler')
      setOpen(false)
    }
  },
  {
    icon: ArrowUp,
    label: 'Поднять наверх',
    disabled: !selectedNodeNeighbors.value?.prevNode,
    action: () => {
      emit('moveNode', 'up')
      setOpen(false)
    }
  },
  {
    icon: ArrowDown,
    label: 'Опустить вниз',
    disabled: !selectedNodeNeighbors.value?.nextNode,
    action: () => {
      emit('moveNode', 'down')
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
  {
    icon: Trash,
    label: 'Удалить',
    action: () => {
      emit('removeNode')
      setOpen(false)
    }
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
