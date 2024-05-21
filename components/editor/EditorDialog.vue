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
            "type": "heading",
            "attrs": {
                "pinned": false,
                "spoiler": false,
                "level": 1
            },
            "content": [
                {
                    "type": "text",
                    "text": "Черные дыры: Загадки Вселенной"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "text",
                    "text": "Черные дыры являются одними из самых загадочных и захватывающих объектов во Вселенной. Они привлекают внимание ученых и любителей астрономии своими удивительными свойствами и непостижимой природой. В этой статье мы рассмотрим, что такое черные дыры, как они образуются и какие необычные явления с ними связаны."
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "pinned": false,
                "spoiler": false,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Что такое черная дыра?"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "text",
                    "text": "Черная дыра — это область пространства, в которой гравитация настолько сильна, что ничто, даже свет, не может покинуть ее пределы. Граница черной дыры называется "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "bold"
                        }
                    ],
                    "text": "горизонтом событий"
                },
                {
                    "type": "text",
                    "text": ". За пределами этого горизонта информация о любых объектах становится недоступной для внешнего наблюдателя."
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "pinned": false,
                "spoiler": false,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Образование черных дыр"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "text",
                    "text": "Черные дыры могут образовываться несколькими способами, но наиболее распространены следующие механизмы:"
                }
            ]
        },
        {
            "type": "orderedList",
            "attrs": {
                "pinned": false,
                "spoiler": false,
                "start": 1
            },
            "content": [
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Гравитационный коллапс"
                                },
                                {
                                    "type": "text",
                                    "text": ". Когда массивная звезда исчерпывает своё термоядерное топливо, её ядро может коллапсировать под действием собственной гравитации, образуя черную дыру."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Слияние звезд"
                                },
                                {
                                    "type": "text",
                                    "text": ". Две нейтронные звезды или белые карлики могут сливаться, образуя черную дыру."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Аккреция массы"
                                },
                                {
                                    "type": "text",
                                    "text": ". Сверхмассивные черные дыры могут расти, поглощая окружающее вещество и сливаясь с другими черными дырами."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "pinned": false,
                "spoiler": false,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Классификация черных дыр"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "text",
                    "text": "Черные дыры можно классифицировать по их массе:"
                }
            ]
        },
        {
            "type": "bulletList",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Планетарные черные дыры"
                                },
                                {
                                    "type": "text",
                                    "text": ": масса менее 3 солнечных масс."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Сверхмассивные черные дыры"
                                },
                                {
                                    "type": "text",
                                    "text": ": масса от миллионов до миллиардов солнечных масс."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Первичные черные дыры"
                                },
                                {
                                    "type": "text",
                                    "text": ": гипотетические черные дыры, образовавшиеся вскоре после Большого взрыва."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "pinned": false,
                "spoiler": false,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Интересные факты о черных дырах"
                }
            ]
        },
        {
            "type": "bulletList",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Горизонт событий"
                                },
                                {
                                    "type": "text",
                                    "text": ": Все, что пересекает горизонт событий, не может вернуться назад. Это делает черные дыры невидимыми в традиционном смысле."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Спагеттификация"
                                },
                                {
                                    "type": "text",
                                    "text": ": Объекты, приближающиеся к черной дыре, могут быть растянуты в тонкую нить из-за сильных приливных сил. Этот процесс называется "
                                },
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "italic"
                                        }
                                    ],
                                    "text": "спагеттификацией"
                                },
                                {
                                    "type": "text",
                                    "text": "."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Время и пространство"
                                },
                                {
                                    "type": "text",
                                    "text": ": Вблизи черной дыры время замедляется, а пространство искривляется. Это явление предсказывается общей теорией относительности Эйнштейна."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Гравитационные волны"
                                },
                                {
                                    "type": "text",
                                    "text": ": Слияние черных дыр вызывает выброс гравитационных волн, которые могут быть обнаружены на Земле с помощью специальных детекторов, таких как LIGO и Virgo."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "pinned": false,
                "spoiler": false,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Исследование черных дыр"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "text",
                    "text": "Современные технологии позволяют ученым исследовать черные дыры и их окрестности. Вот некоторые методы, используемые для изучения этих загадочных объектов:"
                }
            ]
        },
        {
            "type": "bulletList",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Рентгеновская астрономия"
                                },
                                {
                                    "type": "text",
                                    "text": ": Черные дыры, поглощающие вещество, излучают мощное рентгеновское излучение, которое можно наблюдать с помощью космических телескопов."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Гравитационные волны"
                                },
                                {
                                    "type": "text",
                                    "text": ": Обнаружение гравитационных волн позволяет изучать слияние черных дыр и другие катастрофические события."
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
                                "pinned": false,
                                "spoiler": false
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "bold"
                                        }
                                    ],
                                    "text": "Радиоастрономия"
                                },
                                {
                                    "type": "text",
                                    "text": ": Радиотелескопы, такие как Event Horizon Telescope (EHT), позволяют получать изображения горизонта событий черных дыр."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "text",
                    "text": "Черные дыры остаются одной из самых захватывающих тем в современной астрофизике. Их изучение помогает нам лучше понять фундаментальные законы природы и структуру Вселенной."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "pinned": false,
                "spoiler": false
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "italic"
                        }
                    ],
                    "text": "Для дальнейшего чтения и углубления в тему, рекомендуем ознакомиться с работами Стивена Хокинга и Роджера Пенроуза, а также последними научными статьями по астрономии и физике."
                }
            ]
        }
    ]
}

const editorDialogClasses = computed(() => 'fixed inset-0 w-full h-full max-w-[780px] max-h-[800px]')
</script>
