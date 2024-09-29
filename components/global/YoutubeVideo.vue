<template>
  <div
    class="w-full h-full aspect-video rounded-xl overflow-hidden group/overlay"
    :class="{
      'relative after:absolute after:inset-0': isPaused || isError,
    }"
    @click="isPaused ? play() : undefined"
  >
    <div
      v-show="status === 'loaded' && hasBeenInteraction"
      class="w-full h-full aspect-video"
      ref="videoRef"
    />

    <div
      v-if="status !== 'loaded' || !hasBeenInteraction"
      class="relative w-full h-full flex items-center justify-center cursor-pointer after:absolute after:inset-0 after:bg-black/35"
      ref="placeholderRef"
      @click="hasBeenInteraction = true"
    >
      <NuxtImg
        :src="placeholder"
        loading="lazy"
        class="absolute w-full h-full object-cover"
      />

      <IIconsYoutube
        class="!size-16 z-[1] text-red-600 group-hover/overlay:text-black transition-colors duration-[250ms]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  videoId: string
}>()

const placeholderRef = ref<HTMLElement>()
const videoRef = ref<HTMLElement>()

const trigger = useScriptTriggerElement({
  trigger: 'mousedown',
  el: placeholderRef.value,
})

const { status, onLoaded } = useScriptYouTubePlayer({
  scriptOptions: {
    trigger,
  },
})

const hasBeenInteraction = ref(false)

watch(hasBeenInteraction, async (v) => {
  if (status.value !== 'loaded') return

  if (v) {
    await nextTick()
    initPlayer()
  }
})

const player = ref<YT.Player>()

function initPlayer() {
  if (!hasBeenInteraction.value) return

  player.value = new YT.Player(videoRef.value as HTMLElement, {
    videoId: props.videoId,
    playerVars: {
      autoplay: 1,
      mute: 1,
    },
    events: {
      onError() {
        isError.value = true
      },

      onStateChange(e) {
        onStateChange(e)
      },
    },
  })
}

onMounted(() => {
  if (status.value === 'loaded') {
    initPlayer()
    return
  }

  onLoaded(async (instance) => {
    const youTube =
      instance.YT instanceof Promise ? await instance.YT : instance.YT

    await new Promise<void>((resolve) => {
      if (typeof YT.Player === 'undefined') youTube.ready(resolve)
      else resolve()
    })

    initPlayer()
  })
})

const placeholder = computed(
  () => `https://i.ytimg.com/vi_webp/${props.videoId}/sddefault.webp`
)

const isPaused = ref(false)
const isError = ref(false)

function onStateChange(e: YT.OnStateChangeEvent) {
  isPaused.value = e.data === 2
}

function play() {
  isPaused.value = false
  player.value?.playVideo()
}
</script>
