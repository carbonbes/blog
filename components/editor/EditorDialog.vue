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
            url: null,
            embed: {
              author: {
                avatar:
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1721636992/kkonmi8z730xj8yc9j7y.jpg',
                name: 'Код Дурова',
                username: 'd_code',
                url: 'https://t.me/d_code',
              },
              text: '🪙 Жетоны подключили //\n\nПопулярный криптокошелёк Trust Wallet добавил поддержку жетонов в Сети TON. Теперь пользователи приложения смогут управлять практически всеми своими активами на блокчейне TON.\n\nНапомним, ранее в Сети TON состоялась интеграция самого популярного стейблкоина — USDt. Всего за несколько месяцев общая эмиссия в Сети составила более 730 млн USDt, для Tether это стало лучшим показателем среди всех блокчейнов.\n\n@d_code',
              media: [
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721636993/a9rdf7gye1v0rm8sa5rk.jpg',
                  width: 2121,
                  height: 1453,
                  type: 'image',
                },
              ],
              published: 1721489663000,
              type: 'telegram',
              url: 'https://t.me/d_code/19708',
            },
            type: 'telegram',
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
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1721645137/ekmbi0ct8hguiholr5h2.jpg',
                name: 'Big Geek',
                username: 'biggeekru',
                url: 'https://t.me/biggeekru',
              },
              text: 'Unihertz представила новое поколение своего компактного смартфона — Jelly Max\n\nТеперь это самый маленький смартфон на рынке с поддержкой 5G. Из других интересных фишек: прозрачная задняя крышка и ремешок на руку в комплекте. Отдельно можно докупить ремешок через плечо.\n\n• Дисплей: 5,05" 1520x720 IPS\n• Чипсет: Dimensity 7300\n• Камеры: 100 Мп + 8 Мп телевик + 32 Мп селфи\n• Память: 12/256 ГБ + microSD\n• Связь: 5G, NFC, Wi-Fi 6, Bluetooth 5.3\n• Биометрия: сканер отпечатков на спинке\n• Водозащита: нет\n• Аккумулятор и зарядка: 4000 мАч, 66 Вт\n• Габариты: 128,7 х 62,7 x 16,3 мм\n• Цена: $339 (~29 900 ₽)',
              media: [
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721645138/abpgejskpsy820i5d9vf.jpg',
                  width: 780,
                  height: 440,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721645138/a0osvtjptkxgczi3jkdm.jpg',
                  width: 780,
                  height: 440,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721645138/fwcmqqplueotgahdx0q1.jpg',
                  width: 680,
                  height: 680,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1721645138/vs29j9ut6u2tdmcxvrkd.jpg',
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
