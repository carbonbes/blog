<template>
  <Dialog :class="editorDialogClasses" @close="setOpen(false)" ref="dialogRef">
    <Editor :data :disableScroll="scrollIsLocked"/>

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
  "type": "doc",
  "content": [
    {
      "type": "rootNode",
      "attrs": {
        "pin": false,
        "spoiler": false
      },
      "content": [
        {
          "type": "heading",
          "attrs": {
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "Илья Найшуллер завершил съёмки фильма Heads of State — в нём сыграли Идрис Эльба и Джон Сина"
            }
          ]
        }
      ]
    },
    {
      "type": "rootNode",
      "attrs": {
        "pin": false,
        "spoiler": false
      },
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Одну их второстепенных ролей в комедийном боевике для Amazon исполнил Александр Кузнецов."
            }
          ]
        }
      ]
    },
    {
      "type": "rootNode",
      "attrs": {
        "pin": false,
        "spoiler": false
      },
      "content": [
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Съёмки Heads of State («Главы государств») завершились, о чём в своих социальных сетях "
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
                      "text": " режиссёр фильма Илья Найшуллер."
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
      "attrs": {
        "pin": false,
        "spoiler": false
      },
      "content": [
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Постановщик собрал для ленты звёздный каст. Ключевых героев сыграли Идрис Эльба («Лютер»), Джон Сина («Миротворец»), Приянка Чопра Джонас («Матрица: Воскрешение), Карла Гуджино («Призрак дома на холме») и Джек Куэйд («Пацаны»). Одну из второстепенных ролей исполнил российский актёр Александр Кузнецов. Планировалось, что в Heads of State также появится Данила Поперечный, но, судя по словам комика, сцены с ним всё же не будет."
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
    },
    {
      "type": "rootNode",
      "attrs": {
        "pin": false,
        "spoiler": false
      },
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "marks": [
                {
                  "type": "link",
                  "attrs": {
                    "href": "https://dtf.ru/tag/%D0%BD%D0%B0%D0%B9%D1%88%D1%83%D0%BB%D0%BB%D0%B5%D1%80",
                    "target": "_blank",
                    "rel": "noopener noreferrer nofollow",
                    "class": null
                  }
                }
              ],
              "text": "#найшуллер"
            },
            {
              "type": "text",
              "text": " "
            },
            {
              "type": "text",
              "marks": [
                {
                  "type": "link",
                  "attrs": {
                    "href": "https://dtf.ru/tag/headsofstate",
                    "target": "_blank",
                    "rel": "noopener noreferrer nofollow",
                    "class": null
                  }
                }
              ],
              "text": "#headsofstate"
            },
            {
              "type": "text",
              "text": " "
            },
            {
              "type": "text",
              "marks": [
                {
                  "type": "link",
                  "attrs": {
                    "href": "https://dtf.ru/tag/amazon",
                    "target": "_blank",
                    "rel": "noopener noreferrer nofollow",
                    "class": null
                  }
                }
              ],
              "text": "#amazon"
            },
            {
              "type": "text",
              "text": " "
            },
            {
              "type": "text",
              "marks": [
                {
                  "type": "link",
                  "attrs": {
                    "href": "https://dtf.ru/tag/%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8",
                    "target": "_blank",
                    "rel": "noopener noreferrer nofollow",
                    "class": null
                  }
                }
              ],
              "text": "#новости"
            }
          ]
        }
      ]
    }
  ]
}

const editorDialogClasses = computed(() => 'fixed inset-0 w-full h-full max-w-[780px] max-h-[800px]')
</script>
