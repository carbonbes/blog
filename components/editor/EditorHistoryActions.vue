<template>
  <Flex class="gap-2">
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
  </Flex>
</template>

<script lang="ts" setup>
const { editor } = useEditor()
const { pending } = useEditorDialogArticle()

const canUndo = computed(() => editor.value?.can().undo())
const canRedo = computed(() => editor.value?.can().redo())

function undo() {
  editor.value?.chain().focus().undo().run()
}

function redo() {
  editor.value?.chain().focus().redo().run()
}
</script>
