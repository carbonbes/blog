<template>
  <Flex itemsCenter class="ml-auto gap-2">
    <UIButton variant="secondary" :disabled="!canUndo" class="rounded-xl" @click="undo">
      <ITablerArrowBackUp />
    </UIButton>

    <UIButton variant="secondary" :disabled="!canRedo" class="rounded-xl" @click="redo">
      <ITablerArrowForwardUp />
    </UIButton>

    <UIButton class="rounded-xl" @click="console.log(editor?.getJSON())">
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
