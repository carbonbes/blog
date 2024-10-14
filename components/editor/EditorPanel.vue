<template>
  <Flex itemsCenter class="ml-auto gap-2">
    <Flex v-if="savingIndicatorIsShow" center class="relative mx-2 w-6 h-6">
      <FadeInOpacityTransition>
        <Loader
          v-if="state.pending"
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
        :disabled="!canUndo || state.pending"
        class="rounded-xl"
        @click="undo"
      >
        <ITablerArrowBackUp />
      </UIButton>
    </Tooltip>

    <Tooltip tooltip="Вернуть">
      <UIButton
        variant="secondary"
        :disabled="!canRedo || state.pending"
        class="rounded-xl"
        @click="redo"
      >
        <ITablerArrowForwardUp />
      </UIButton>
    </Tooltip>

    <UIButton
      class="rounded-xl flex items-center gap-3"
      @click="emits('save')"
      :disabled="state.pending"
    >
      <p>Сохранить</p>
    </UIButton>
  </Flex>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  save: [void]
}>()

const { editor } = useEditor()
const { state } = useEditorDialog()

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
