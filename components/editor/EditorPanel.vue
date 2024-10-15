<template>
  <Flex itemsCenter class="gap-2">
    <Flex v-if="savingIndicatorIsShow" center class="relative px-2">
      <FadeInOpacityTransition>
        <Loader
          v-if="pending"
          color="!bg-black"
          class="absolute"
          @vue:mounted="savingIndicatorIsShow = true"
        />

        <TemporalElement
          v-else
          :timeout="1500"
          @vue:unmounted="savingIndicatorIsShow = false"
        >
          <ITablerCheck class="absolute text-green-500" />
        </TemporalElement>
      </FadeInOpacityTransition>
    </Flex>

    <Tooltip tooltip="Отменить">
      <UIButton
        variant="secondary"
        :disabled="!canUndo || pending"
        class="rounded-xl"
        @click="undo"
      >
        <ITablerArrowBackUp />
      </UIButton>
    </Tooltip>

    <Tooltip tooltip="Вернуть">
      <UIButton
        variant="secondary"
        :disabled="!canRedo || pending"
        class="rounded-xl"
        @click="redo"
      >
        <ITablerArrowForwardUp />
      </UIButton>
    </Tooltip>

    <UIButton
      class="rounded-xl flex items-center gap-3"
      @click="article?.status === 'draft' ? emits('publish') : emits('save')"
      :disabled="pending"
    >
      {{ article?.status === 'draft' ? 'Опубликовать' : 'Сохранить' }}
    </UIButton>
  </Flex>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  publish: [void]
  save: [void]
}>()

const { editor } = useEditor()
const { pending, article } = useArticle()

const savingIndicatorIsShow = ref(true)

const canUndo = computed(() => editor.value?.can().undo())
const canRedo = computed(() => editor.value?.can().redo())

function undo() {
  editor.value?.chain().focus().undo().run()
}

function redo() {
  editor.value?.chain().focus().redo().run()
}
</script>
