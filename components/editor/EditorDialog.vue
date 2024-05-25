<template>
  <Dialog :class="editorDialogClasses" @close="setOpen(false)" ref="dialogRef">
    <Editor :data />

    <template #footer>
      <EditorPanel />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'

const dialogRef = ref<InstanceType<typeof Dialog>>()

const { setOpen } = useEditorDialog(dialogRef)

const data = {
  "type": "doc",
  "content": [
    {
      "type": "rootNode",
      "content": [
        {
          "type": "heading",
          "attrs": {
            "pin": false,
            "spoiler": false,
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "Илья Найшуллер завершил съёмки фильма Heads of State — в нём сыграли Идрис Эльба и Джон Сина "
            }
          ]
        }
      ]
    },
    {
      "type": "rootNode",
      "content": [
        {
          "type": "paragraph",
          "attrs": {
            "pin": false,
            "spoiler": false
          },
          "content": [
            {
              "type": "text",
              "text": "Одни их второстепенных ролей в комедийном боевике для Amazon исполнили Александр Кузнецов и Данила Поперечный."
            }
          ]
        }
      ]
    },
    {
      "type": "rootNode",
      "content": [
        {
          "type": "bulletList",
          "attrs": {
            "pin": false,
            "spoiler": false
          },
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "attrs": {
                    "pin": false,
                    "spoiler": false
                  },
                  "content": [
                    {
                      "type": "text",
                      "text": "Съёмки Heads of State («Главы государств») завершились, о чём в своих социальных сетях "
                    },
                    {
                      "type": "text",
                      "marks": [
                        {
                          "type": "link",
                          "attrs": {
                            "href": "https://x.com/kinopoiskru/status/1794260999283020142",
                            "target": "_blank",
                            "rel": "nofollow noreferrer noopener",
                            "class": null
                          }
                        }
                      ],
                      "text": "сообщил"
                    },
                    {
                      "type": "text",
                      "text": " режиссёр фильма Илья Найшуллер."
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "attrs": {
                    "pin": false,
                    "spoiler": false
                  },
                  "content": [
                    {
                      "type": "text",
                      "text": "Производство фильма стартовало в мае 2023-го. Таким образом, работа на площадке заняла чуть больше года."
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "attrs": {
                    "pin": false,
                    "spoiler": false
                  },
                  "content": [
                    {
                      "type": "text",
                      "text": "Сюжетные детали картины держатся в секрете. Известно, что это будет комедийный боевик, вдохновлённый «Самолётом президента», «Молодыми копами» и «Успеть до полуночи»."
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "rootNode",
      "content": [
        {
          "type": "bulletList",
          "attrs": {
            "pin": false,
            "spoiler": false
          },
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "attrs": {
                    "pin": false,
                    "spoiler": false
                  },
                  "content": [
                    {
                      "type": "text",
                      "text": "Постановщик собрал для ленты звёздный каст. Ключевых героев сыграли Идрис Эльба («Лютер»), Джон Сина («Миротворец»), Приянка Чопра Джонас («Матрица: Воскрешение), Карла Гуджино («Призрак дома на холме») и Джек Куэйд («Пацаны»). Одни из второстепенных ролей исполнили российский актёр Александр Кузнецов и комик Данила Поперечный."
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "attrs": {
                    "pin": false,
                    "spoiler": false
                  },
                  "content": [
                    {
                      "type": "text",
                      "text": "Илья Найшуллер снял Heads of State для Amazon MGM Studios. В компании одобрили фильм ещё в 2020-м, когда общались с режиссёром по видеозвонку в Zoom."
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "attrs": {
                    "pin": false,
                    "spoiler": false
                  },
                  "content": [
                    {
                      "type": "text",
                      "text": "Даже примерной даты релиза у картины пока что нет."
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

const editorDialogClasses = computed(() => 'fixed inset-0 w-full h-full max-w-[780px] max-h-[800px] rounded-[unset] min-[780px]:rounded-xl')
</script>
