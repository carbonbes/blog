<template>
  <Flex itemsCenter class="ml-auto gap-2">
    <UIButton
      variant="secondary"
      :disabled="!canUndo || state.pending"
      class="rounded-xl"
      @click="undo"
    >
      <ITablerArrowBackUp />
    </UIButton>

    <UIButton
      variant="secondary"
      :disabled="!canRedo || state.pending"
      class="rounded-xl"
      @click="redo"
    >
      <ITablerArrowForwardUp />
    </UIButton>

    <UIButton
      class="rounded-xl flex items-center gap-3"
      @click="console.log(editor?.getJSON())"
      :disabled="state.pending"
    >
      Сохранить
      <Loader v-if="state.pending" />
    </UIButton>
  </Flex>
</template>

<script lang="ts" setup>
const { editor } = useEditor()
const { state } = useEditorDialog()

const canUndo = computed(() => editor.value?.can().undo())
const canRedo = computed(() => editor.value?.can().redo())

function undo() {
  editor.value?.chain().focus().undo().run()
}

function redo() {
  editor.value?.chain().focus().redo().run()
}
</script>
