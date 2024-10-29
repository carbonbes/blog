<template>
  <Html :style="'--drawer-footer-height: 0px'" />

  <DrawerRoot
    v-bind="forward"
    v-model:open="isOpen"
    :snapPoints
    :activeSnapPoint
    :fadeFromIndex="0"
    v-model:activeSnapPoint="activeSnapPoint"
  >
    <DrawerPortal :to="portalTo">
      <DrawerOverlay
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        @click="isOpen = false"
      />

      <DrawerContent
        aria-describedby=""
        v-bind="props"
        class="fixed right-0 bottom-0 left-0 w-full h-full max-h-[95%] bg-white rounded-t-2xl"
        ref="drawerContentRef"
      >
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <Flex col center class="py-4 pb-8">
          <div class="absolute w-10 h-1 bg-gray-400 rounded-full" />
        </Flex>

        <Primitive
          asChild
          class="px-4 w-full h-[calc(100%-48px-var(--drawer-footer-height))] overflow-y-auto"
          :class="[contentClass, scrollableContentClasses]"
          ref="scrollableContentRef"
        >
          <slot />
        </Primitive>

        <Primitive
          v-if="$slots.footer"
          class="h-20"
          :class="[footerClass]"
          asChild
        >
          <slot name="footer" />
        </Primitive>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script lang="ts" setup>
import { DialogTitle, useForwardPropsEmits } from 'radix-vue'
import {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  type DrawerRootProps,
  type DrawerRootEmits,
} from 'vaul-vue'

const props = withDefaults(
  defineProps<
    DrawerRootProps & {
      class?: string
      contentClass?: string
      footerClass?: string
      portalTo: string
    }
  >(),
  {
    portalTo: 'body',
  }
)

const emits = defineEmits<DrawerRootEmits>()

const forward = useForwardPropsEmits(props, emits)

const isOpen = ref(false)

async function setOpen(value: boolean) {
  isOpen.value = value
}

const snapPoints = ref([0.5, 1])
const activeSnapPoint = ref(snapPoints.value[0])

function expandTo(value: number) {
  activeSnapPoint.value = value
}

function expandToMax() {
  activeSnapPoint.value = snapPoints.value[snapPoints.value.length - 1]
}

const drawerContentRef = ref<InstanceType<typeof DrawerContent>>()
const drawerContentScrollableContentRef = ref<HTMLElement>()
const scrollableContentRef = ref<HTMLDivElement>()

async function setDrawerContentScrollableContentRef() {
  await nextTick()
  drawerContentScrollableContentRef.value = drawerContentRef.value?.$el
}

watch(isOpen, (v) => {
  if (v) {
    setDrawerContentScrollableContentRef()
  }
})

const { isSwiping, direction: swipeDirection } = usePointerSwipe(
  drawerContentScrollableContentRef,
  { threshold: 0 }
)

const { y } = useScroll(scrollableContentRef)

const scrollableContentClasses = computed(() => ({
  '!overflow-hidden':
    activeSnapPoint.value !== 1 ||
    (activeSnapPoint.value === 1 &&
      y.value === 0 &&
      isSwiping.value &&
      swipeDirection.value === 'down'),

  '!overflow-y-auto':
    activeSnapPoint.value === 1 &&
    y.value === 0 &&
    isSwiping.value &&
    swipeDirection.value === 'up',
}))

defineExpose({ setOpen, expandTo, expandToMax })
</script>
