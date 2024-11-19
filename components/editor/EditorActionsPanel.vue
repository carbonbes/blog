<template>
  <Flex itemsCenter justifyBetween class="w-full">
    <EditorHistoryActions class="hidden sm:flex" />

    <Flex class="gap-2 flex-row-reverse sm:flex-row">
      <Flex v-if="savingIndicatorIsShow" center class="relative size-[40px]">
        <FadeInOpacityTransition>
          <Loader v-if="pending" color="!bg-black" class="absolute" />

          <TemporalElement
            v-else
            :timeout="1500"
            @unmounted="onTemporalElIsUnmounted"
          >
            <ITablerCheck class="absolute text-green-500" />
          </TemporalElement>
        </FadeInOpacityTransition>
      </Flex>

      <Tooltip v-if="article" :tooltip="`Статус: ${status?.label}`">
        <Flex center class="size-[40px] cursor-pointer group">
          <div
            class="size-2 rounded-full cursor-pointer transition-colors duration-[250ms]"
            :class="status?.class"
          />
        </Flex>
      </Tooltip>

      <Tooltip v-if="article" tooltip="Предпросмотр записи">
        <UIButton
          variant="secondary"
          class="rounded-xl"
          :disabled="pending || uploading"
          :to="articleURL"
          target="_blank"
        >
          <ITablerEye />
        </UIButton>
      </Tooltip>

      <UIButton
        v-if="article"
        class="flex items-center gap-3 rounded-xl"
        @click="emits('save')"
        :disabled="pending || uploading"
      >
        Сохранить
      </UIButton>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'

const emits = defineEmits<{
  publish: [void]
  save: [void]
}>()

const { pending, uploading, article } = useEditorDialog()

watch(pending, (v) => {
  if (v) savingIndicatorIsShow.value = true
})

async function onTemporalElIsUnmounted() {
  await promiseTimeout(250)
  savingIndicatorIsShow.value = false
}

const savingIndicatorIsShow = ref(false)

const status = computed(() => {
  if (!article.value) return

  const statuses = {
    draft: {
      class: 'bg-red-500 group-hover:bg-red-300',
      label: 'Черновик',
    },
    published: {
      class: 'bg-green-500 group-hover:bg-green-300',
      label: 'Опубликован',
    },
    scheduled: {
      class: 'bg-blue-500 group-hover:bg-blue-300',
      label: 'Запланирован',
    },
  }

  return {
    class: statuses[article.value.status].class,
    label: statuses[article.value.status].label,
  }
})

const articleURL = computed(() => {
  if (!article.value) return

  return getArticleURL(article.value)
})
</script>
