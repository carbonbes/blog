<template>
  <Dialog
    :class="editorDialogClasses"
    @pointerDownOutside="(e) => previewIsOpen && e.preventDefault()"
    @close="setOpen(false)"
    ref="dialogRef"
  >
    <Editor :data :disableScroll="scrollIsLocked" />

    <template #footer>
      <EditorPanel />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'

const dialogRef = ref<InstanceType<typeof Dialog>>()

const { setOpen, scrollIsLocked } = useEditorDialog(dialogRef)
const { previewIsOpen } = useImagePreview()

const data = {
  type: 'doc',
  content: [
    {
      type: 'rootNode',
      attrs: {
        pin: false,
        spoiler: false,
      },
      content: [
        {
          type: 'sn-embed',
          attrs: {
            embed: {
              author: {
                avatar:
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1719922253/o98vmx7cqtubtodzplls.jpg',
                name: 'Шизойд',
                username: 'sebullllba',
              },
              text: '«Посмотрел Слово пацана», «а я вот этот сериал», «а я буду стопиццотый раз пересматривать Друзей», «а я - дом Дракона». \n\nУ вас у всех чересчур дохуя свободного времени (сказано с интонацией деда из Brassic. \n\nВсе, можете накидываться.',
              media: [
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/video/upload/v1719922253/kvjrbzptdbfrzm0rwfjm.mp4',
                  width: 480,
                  height: 480,
                  type: 'gif',
                },
              ],
              published: 'Mon Dec 04 14:26:50 +0000 2023',
              type: 'x',
            },
            type: 'x',
          },
        },
      ],
    },
  ],
}

const editorDialogClasses = computed(
  () => 'fixed inset-0 w-full h-full max-w-[780px] sm:max-h-[800px]'
)
</script>
