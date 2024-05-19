<template>
  <Flex itemsCenter class="ml-auto gap-2">
    <UIButton variant="secondary" :disabled="!canUndo" @click="undo">
      <ITablerArrowBackUp />
    </UIButton>

    <UIButton variant="secondary" :disabled="!canRedo" @click="redo">
      <ITablerArrowForwardUp />
    </UIButton>

    <UIButton @click="console.log(editor?.getJSON())">
      Сохранить
    </UIButton>
  </Flex>
</template>

<script lang="ts" setup>
const { editor } = useEditor()

const canUndo = computed(() => editor.value?.can().undo())
const canRedo = computed(() => editor.value?.can().redo())

function undo() {
  editor.value?.chain().focus().undo().run()
}

function redo() {
  editor.value?.chain().focus().redo().run()
}
</script>
