<template>
  <Bottomsheet class="!bg-gray-100" @close="onClose" ref="bottomsheetRef">
    <template #header>
      <FadeInOpacityTransition>
        <button v-if="state.view === 2" @click="state.view = 1">
          <ITablerArrowLeft />
        </button>
      </FadeInOpacityTransition>
    </template>

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
          <UIButton
            v-for="(action, i) in nodeTypesActions"
            :key="i"
            variant="secondary"
            size="l"
            class="flex items-center gap-3"
            @click="action.action"
          >
            <Component :is="action.icon" />
            {{ action.label }}
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
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import Paragraph from '~icons/tabler/letter-case'
import List from '~icons/tabler/list'
import ListNumbers from '~icons/tabler/list-numbers'

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

const nodeTypesActions = computed(() => [
  {
    icon: Heading1,
    label: 'Заголовок 1',
    action: () => {
      
      setOpen(false)
    }
  },
  {
    icon: Heading2,
    label: 'Заголовок 2',
    action: () => {
      
      setOpen(false)
    }
  },
  {
    icon: Paragraph,
    label: 'Текст',
    action: () => {
      
      setOpen(false)
    }
  },
  {
    icon: ListNumbers,
    label: 'Нумерованный список',
    action: () => {
      
      setOpen(false)
    }
  },
  {
    icon: List,
    label: 'Маркированный список',
    action: () => {
      
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
