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
                url: 'https://x.com/sebullllba',
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
              url: 'https://x.com/sebullllba/status/1731681471109157096',
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
                url: 'https://x.com/crazy_kutas',
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
              url: 'https://x.com/crazy_kutas/status/1087569961025970176',
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
                url: 'https://x.com/vanyagradoboev',
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
              url: 'https://x.com/vanyagradoboev/1805370432939327989',
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
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1720086913/duzrezgqmrwamtmwg7ui.jpg',
                name: 'ваня градобоев',
                username: 'vanyagradoboev',
                url: 'https://x.com/vanyagradoboev',
              },
              text: 'кстати, чтобы вы еще чучуть больше охуели - вот это тоже я построил, точнее я это строил параллельно своему дому. остались еще доделки, но в целом получилось два дома за год',
              media: [
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/video/upload/v1720086912/g1bqkociuibtxmshuvzr.mp4',
                  thumbnail:
                    'https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/g1bqkociuibtxmshuvzr.mp4',
                  width: 720,
                  height: 1280,
                  type: 'video',
                },
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/video/upload/v1720086912/loc44hhluwr6w5yluak3.mp4',
                  thumbnail:
                    'https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/loc44hhluwr6w5yluak3.mp4',
                  width: 720,
                  height: 960,
                  type: 'video',
                },
              ],
              published: 'Sun Sep 24 13:35:28 +0000 2023',
              type: 'x',
              url: 'https://x.com/vanyagradoboev/status/1705939005626355739',
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
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1720171037/t0dccw1nvvaya4not1i7.jpg',
                name: 'NASA',
                username: 'NASA',
                url: 'https://x.com/NASA',
              },
              text: "We're launching into #WomensHistoryMonth with a stellar salute to the incredible women who lead the way to change and inspire future generations. We celebrate the accomplishments you’ve made as you to contribute to NASA’s journey to the stars.",
              media: [
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/image/upload/v1720171036/pwyi2p9k7hwbkprbw2to.jpg',
                  width: 1000,
                  height: 839,
                  type: 'image',
                },
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/image/upload/v1720171036/vkxt91ohr3ibnokgojda.jpg',
                  width: 1041,
                  height: 833,
                  type: 'image',
                },
                {
                  url: 'http://res.cloudinary.com/dkmur8a20/image/upload/v1720171036/ybsgxphshmjysz7ur037.jpg',
                  width: 1064,
                  height: 707,
                  type: 'image',
                },
              ],
              published: 'Fri Mar 01 19:36:34 +0000 2024',
              type: 'x',
              url: 'https://x.com/NASA/status/1763649550479241501',
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
