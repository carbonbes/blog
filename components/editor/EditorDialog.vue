<template>
  <Dialog
    :class="editorDialogClasses"
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
            url: null,
            embed: {
              author: {
                avatar:
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897722/fu7cstumcwrdmya947vh.jpg',
                name: 'NASA',
                username: 'NASA',
                url: 'https://x.com/NASA',
              },
              text: "We're launching into #WomensHistoryMonth with a stellar salute to the incredible women who lead the way to change and inspire future generations. We celebrate the accomplishments you’ve made as you to contribute to NASA’s journey to the stars. https://t.co/OfqckHovmp",
              media: [
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897723/nlsc47tbwneaj0henlyj.jpg',
                  width: 1000,
                  height: 839,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897723/ytfussadsfefmle6cdve.jpg',
                  width: 1041,
                  height: 833,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897723/zd9mcrle4pystoxe5saj.jpg',
                  width: 1064,
                  height: 707,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897723/ytfussadsfefmle6cdve.jpg',
                  width: 1041,
                  height: 833,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897723/nlsc47tbwneaj0henlyj.jpg',
                  width: 1000,
                  height: 839,
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
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897995/jikglj27hrh8lb4frkek.jpg',
                name: 'Big Geek',
                username: 'biggeekru',
                url: 'https://t.me/biggeekru',
              },
              text: 'Unihertz представила новое поколение своего компактного смартфона — Jelly Max\n\nТеперь это самый маленький смартфон на рынке с поддержкой 5G. Из других интересных фишек: прозрачная задняя крышка и ремешок на руку в комплекте. Отдельно можно докупить ремешок через плечо.\n\n• Дисплей: 5,05" 1520x720 IPS\n• Чипсет: Dimensity 7300\n• Камеры: 100 Мп + 8 Мп телевик + 32 Мп селфи\n• Память: 12/256 ГБ + microSD\n• Связь: 5G, NFC, Wi-Fi 6, Bluetooth 5.3\n• Биометрия: сканер отпечатков на спинке\n• Водозащита: нет\n• Аккумулятор и зарядка: 4000 мАч, 66 Вт\n• Габариты: 128,7 х 62,7 x 16,3 мм\n• Цена: $339 (~29 900 ₽)',
              media: [
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897996/s69mso1zhoeke85plmc4.jpg',
                  width: 780,
                  height: 440,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897997/ywmifrk7j8fnkipmwqqg.jpg',
                  width: 780,
                  height: 440,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897997/em5ilplxh3twvtyklk8l.jpg',
                  width: 680,
                  height: 680,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721897997/popth5jpq0vqemafu0ps.jpg',
                  width: 680,
                  height: 419,
                  type: 'image',
                },
              ],
              published: 1721203273000,
              type: 'telegram',
              url: 'https://t.me/biggeekru/26500',
            },
            type: 'telegram',
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
