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
            url: null,
            embed: {
              author: {
                avatar:
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1719996822/wa1dnxhbevjbhsbtdzl6.jpg',
                name: 'Разрыхлитель Мозгов™',
                username: 'crazy_kutas',
              },
              text: '#10YearsChallenge\n\nЧто можно купить на 1000 рублей:',
              media: [
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/image/upload/v1719996820/qqrmdcde55frlfbhn3wb.jpg',
                  width: 647,
                  height: 429,
                  type: 'image',
                },
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/image/upload/v1719996820/tyxbsdcckqxodnddilgj.jpg',
                  width: 651,
                  height: 488,
                  type: 'image',
                },
              ],
              published: 'Tue Jan 22 04:37:39 +0000 2019',
              type: 'x',
            },
            type: 'x',
          },
        },
      ],
    },
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
            url: null,
            embed: {
              author: {
                avatar:
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1719998975/zlsomwoabklztu90rvcx.jpg',
                name: 'ваня градобоев',
                username: 'vanyagradoboev',
              },
              text: 'сплю с открытыми окнами, налетает всякое',
              media: [
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/video/upload/v1719998974/csurqofrzkpay3vsdsb5.mp4',
                  thumbnail:
                    'https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/csurqofrzkpay3vsdsb5.mp4',
                  width: 720,
                  height: 720,
                  type: 'video',
                },
              ],
              published: 'Mon Jun 24 22:40:28 +0000 2024',
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
