<template>
  <Dialog
    class="fixed inset-0 w-full h-full max-w-[780px] sm:max-h-[800px] !rounded-none sm:!rounded-xl"
    @close="setOpen(false)"
    ref="dialogRef"
  >
    <Editor />

    <template #footer>
      <EditorPanel />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'
import type Editor from '~/components/editor/Editor.client.vue'

const dialogRef = ref<InstanceType<typeof Dialog>>()

const { setOpen } = useEditorDialog(dialogRef)

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
          type: 'gallery',
          attrs: {
            items: [
              {
                src: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1726058100/rhdfeof2bydo3wc6p9a0.jpg',
                width: 1089,
                height: 1049,
                type: 'image',
                uploaded: true
              },
              {
                src: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1726058100/bh0phkxyhstwl4hzcfr3',
                width: 274,
                height: 274,
                type: 'gif',
                uploaded: true
              },
              {
                src: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1726058100/ib5v29bvtyduyz6uhgx3.jpg',
                width: 1536,
                height: 2048,
                type: 'image',
                uploaded: true
              },
              {
                src: 'https://res.cloudinary.com/dkmur8a20/video/upload/v1726131132/zjr5yupdtyy6qzfjkpok.mp4',
                thumbnail: 'https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/v1726131132/zjr5yupdtyy6qzfjkpok.mp4',
                width: 854,
                height: 480,
                type: 'video',
                uploaded: true
              },
            ],
            forUpload: [],
            galleryOpenFileFromDeviceDialog: false,
            galleryOpenFileFromUrlDialog: false,
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
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1723893272/easydvszdazlrupqip8h.jpg',
                name: 'Big Geek',
                username: 'biggeekru',
                url: 'https://t.me/biggeekru',
              },
              text: 'Samsung представила сервис для удалённого присмотра за пожилыми людьми\n\nС помощью бесплатного сервиса Family Care можно удалённо настраивать умные устройства и управлять ими. \n\nНапример, можно напомнить о приёме лекарств, контролировать бытовую технику и даже следить за местоположением подопечного. Сервис изучает бытовые привычки пользователя и даёт знать, если что-то пошло не так.\n\nНесколько лет назад похожий сервис запускал Amazon, но из-за сложности с сетью и нестабильности устройств, проект не получил развития.\n\nFamily Care станет доступен уже завтра в ограниченном количестве регионов. Он работает на базе умного дома SmartThings и только с гаджетами Samsung.',
              media: [
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1723893274/qt7pkcobezexxcper1pi.jpg',
                  width: 1200,
                  height: 675,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1723893274/xy9jul1tvbzqnn4kuz4l.jpg',
                  width: 1280,
                  height: 1280,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/video/upload/v1723893533/r9waskk3sbixvyzffdqh.mp4',
                  thumbnail:
                    'https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/r9waskk3sbixvyzffdqh.mp4',
                  width: 1080,
                  height: 1080,
                  type: 'video',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1723893274/xy9jul1tvbzqnn4kuz4l.jpg',
                  width: 1280,
                  height: 1280,
                  type: 'image',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/image/upload/v1723893274/qt7pkcobezexxcper1pi.jpg',
                  width: 1200,
                  height: 675,
                  type: 'image',
                },
              ],
              published: 1723727190000,
              type: 'telegram',
              url: 'https://t.me/biggeekru/27110',
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
                  'https://res.cloudinary.com/dkmur8a20/image/upload/v1723893515/nrzazpbcrwswtnuxxrv6.jpg',
                name: 'Big Geek',
                username: 'biggeekru',
                url: 'https://t.me/biggeekru',
              },
              text: 'Нейросеть от Сбера GigaChat умеет не только генерировать текст, но и работать с готовыми материалами.\n\nОна легко сократит объём слов, поможет с переводом на другой язык и перескажет содержание файла. Для этого прикрепите документ в формате txt или pdf и напишите свой запрос. Подсказка 👉 промпт лучше начинать с глаголов.\n\nЭти и другие полезные функции ждут вас здесь.',
              media: [
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/video/upload/v1723893533/r9waskk3sbixvyzffdqh.mp4',
                  thumbnail:
                    'https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/r9waskk3sbixvyzffdqh.mp4',
                  width: 1080,
                  height: 1080,
                  type: 'video',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/video/upload/v1723893533/r9waskk3sbixvyzffdqh.mp4',
                  thumbnail:
                    'https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/r9waskk3sbixvyzffdqh.mp4',
                  width: 1080,
                  height: 1080,
                  type: 'video',
                },
                {
                  url: 'https://res.cloudinary.com/dkmur8a20/video/upload/v1723893533/r9waskk3sbixvyzffdqh.mp4',
                  thumbnail:
                    'https://res.cloudinary.com/dkmur8a20/video/upload/f_webp/r9waskk3sbixvyzffdqh.mp4',
                  width: 1080,
                  height: 1080,
                  type: 'video',
                },
              ],
              published: 1723708876000,
              type: 'telegram',
              url: 'https://t.me/biggeekru/27105',
            },
            type: 'telegram',
          },
        },
      ],
    },
  ],
}
</script>
