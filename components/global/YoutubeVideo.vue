<template>
  <div
    class="w-full h-full aspect-video rounded-xl overflow-hidden group/overlay"
    :class="{
      'relative after:absolute after:inset-0': isPaused || isError,
    }"
    @click="isPaused ? play() : undefined"
  >
    <div
      class="w-full h-full aspect-video"
      v-show="hasBeenInteraction"
      ref="videoRef"
    />

    <div
      v-if="!playerIsReady && !hasBeenInteraction"
      class="relative w-full h-full flex items-center justify-center cursor-pointer"
      ref="placeholderRef"
      @click="hasBeenInteraction = true"
    >
      <NuxtImg
        :src="placeholder"
        loading="lazy"
        class="absolute w-full h-full object-cover"
      />

      <IIconsYoutube
        class="!size-16 z-[1] group-hover/overlay:text-red-600 transition-colors"
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

const player = ref<YT.Player>()

const playerIsReady = ref(false)
const hasBeenInteraction = ref(false)

watch(hasBeenInteraction, async (v) => {
  if (status.value === 'loaded' && v) {
    await nextTick()
    initPlayer()
  }
})

function initPlayer() {
  if (!hasBeenInteraction.value) return

  player.value = new YT.Player(videoRef.value as HTMLElement, {
    videoId: props.videoId,
    playerVars: {
      autoplay: 1,
      mute: 1,
    },
    events: {
      onReady() {
        playerIsReady.value = true
      },

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
  if (e.data === 1) isPaused.value = false
  if (e.data === 2) isPaused.value = true
}

function play() {
  isPaused.value = false
  player.value?.playVideo()
}
</script>
