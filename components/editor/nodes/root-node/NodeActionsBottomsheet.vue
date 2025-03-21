<template>
  <Drawer
    class="!bg-gray-100 after:!bg-gray-100"
    contentClass="!px-0"
    @update:open="onOpen"
    ref="drawerRef"
  >
    <template #footer>
      <FadeInOpacityTransition>
        <div v-if="state.view === 2" class="p-4">
          <UIButton
            size="l"
            class="w-full flex items-center justify-center gap-3 !rounded-2xl !shadow"
            @click="prevView"
          >
            Назад
          </UIButton>
        </div>
      </FadeInOpacityTransition>
    </template>

    <div>
      <Swiper
        :spaceBetween="50"
        :speed="250"
        :allowTouchMove="false"
        slide-prev-class="!h-0"
        slide-next-class="!h-0"
        slide-active-class="!h-full"
        ref="swiperRef"
      >
        <SwiperSlide :class="slideClasses">
          <UIButton
            v-for="(button, i) in firstSlideButtons"
            :key="i"
            variant="secondary"
            size="l"
            :class="[slideButtonClasses, { 'text-blue-500': button.active }]"
            @click="button.action"
            :disabled="button.disabled"
          >
            <Component :is="button.icon" />
            {{ button.label }}
            <ITablerChevronRight v-if="button.additional" class="ml-auto" />
          </UIButton>
        </SwiperSlide>

        <SwiperSlide :class="slideClasses">
          <UIButton
            v-for="(button, i) in secondSlideButtons"
            :key="i"
            variant="secondary"
            size="l"
            :class="slideButtonClasses"
            @click="button.action"
            :disabled="button.disabled"
          >
            <Component :is="button.icon" />
            {{ button.label }}
          </UIButton>
        </SwiperSlide>
      </Swiper>
    </div>
  </Drawer>
</template>

<script lang="ts" setup>
import type Drawer from '~/components/global/Drawer.vue'
import Swiper from '~/components/global/swiper/Swiper.vue'
import SwiperSlide from '~/components/global/swiper/SwiperSlide.vue'
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
}>()

const swiperRef = ref<InstanceType<typeof Swiper>>()

const {
  selectedNodeType,
  selectedNodeAttrs,
  selectedNodeNeighbors,
  toggleNodeAttribute,
  moveNode,
  removeNode,
  changeNodeType,
} = useEditor()

const state = reactive({
  view: 1,
})

function onOpen(value: boolean) {
  emit('onOpen', value)

  if (!value) resetView()
}

function prevView() {
  swiperRef.value?.swiper?.slidePrev()
  state.view--
}

function nextView() {
  swiperRef.value?.swiper?.slideNext()
  state.view++
}

function resetView() {
  swiperRef.value?.swiper?.slideTo(0)
  state.view = 1
}

const slideClasses = 'px-4 pb-4 w-full h-full flex flex-col gap-4'
const slideButtonClasses = 'flex items-center gap-3 !rounded-2xl !shadow'

const firstSlideButtons = computed(() => [
  {
    icon: Pin,
    label: 'Вывести в карточке',
    active: selectedNodeAttrs.value?.pin,
    action: () => {
      toggleNodeAttribute('pin')
      setOpen(false)
    },
  },
  {
    icon: EyeOff,
    label: 'Скрыть',
    active: selectedNodeAttrs.value?.spoiler,
    action: () => {
      toggleNodeAttribute('spoiler')
      setOpen(false)
    },
  },
  {
    icon: ArrowUp,
    label: 'Поднять наверх',
    disabled: !selectedNodeNeighbors.value?.prevNode,
    action: () => {
      moveNode('up')
      setOpen(false)
    },
  },
  {
    icon: ArrowDown,
    label: 'Опустить вниз',
    disabled: !selectedNodeNeighbors.value?.nextNode,
    action: () => {
      moveNode('down')
      setOpen(false)
    },
  },
  {
    icon: Refresh,
    label: 'Поменять на',
    disabled: ['sn-embed', 'gallery', 'link', 'separator'].includes(
      selectedNodeType.value
    ),
    action: () => nextView(),
    additional: true,
  },
  {
    icon: Trash,
    label: 'Удалить',
    action: () => {
      removeNode()
      setOpen(false)
    },
  },
])

const secondSlideButtons = computed(() => [
  {
    icon: Heading1,
    label: 'Заголовок 1',
    disabled:
      selectedNodeType.value === 'heading' &&
      selectedNodeAttrs.value.level === 1,
    action: () => {
      changeNodeType({ type: 'heading', attrs: { level: 1 } })
      setOpen(false)
    },
  },
  {
    icon: Heading2,
    label: 'Заголовок 2',
    disabled:
      selectedNodeType.value === 'heading' &&
      selectedNodeAttrs.value.level === 2,
    action: () => {
      changeNodeType({ type: 'heading', attrs: { level: 2 } })
      setOpen(false)
    },
  },
  {
    icon: Paragraph,
    label: 'Текст',
    disabled: selectedNodeType.value === 'paragraph',
    action: () => {
      changeNodeType({ type: 'paragraph' })
      setOpen(false)
    },
  },
  {
    icon: ListNumbers,
    label: 'Нумерованный список',
    disabled: selectedNodeType.value === 'orderedList',
    action: () => {
      changeNodeType({ type: 'orderedList' })
      setOpen(false)
    },
  },
  {
    icon: List,
    label: 'Маркированный список',
    hide: selectedNodeType.value === 'bulletList',
    action: () => {
      changeNodeType({ type: 'bulletList' })
      setOpen(false)
    },
  },
])

const drawerRef = ref<InstanceType<typeof Drawer>>()

function setOpen(value: boolean) {
  drawerRef.value?.setOpen(value)
}

defineExpose({ setOpen })
</script>
