<template>
  <Bottomsheet class="h-full max-h-[75vh]" ref="bottomsheetRef">
    <ScrollArea>
      <Flex col class="pb-[25vh] !flex gap-4">
        <UIButton
          v-for="(button, i) in buttons"
          :key="i"
          variant="secondary"
          size="l"
          class="flex items-center gap-3 border-1 border-gray-50 shadow rounded-xl"
        >
          <Component :is="button.icon" />
          {{ button.label }}
        </UIButton>
      </Flex>
    </ScrollArea>
  </Bottomsheet>
</template>

<script lang="ts" setup>
import type Bottomsheet from '~/components/global/Bottomsheet.vue'
import Heading1 from '~icons/tabler/h1'
import Heading2 from '~icons/tabler/h2'
import Paragraph from '~icons/tabler/letter-case'
import ListNumbers from '~icons/tabler/list-numbers'
import List from '~icons/tabler/list'
import Photo from '~icons/tabler/photo'
import Link from '~icons/tabler/link'
import Divider from '~icons/tabler/divide'

const buttons = markRaw([
  {
    icon: Heading1,
    label: 'Заголовок 1'
  },
  {
    icon: Heading2,
    label: 'Заголовок 2'
  },
  {
    icon: Paragraph,
    label: 'Текст'
  },
  {
    icon: ListNumbers,
    label: 'Нумерованный список'
  },
  {
    icon: List,
    label: 'Маркированный список'
  },
  {
    icon: Photo,
    label: 'Картинка / Галерея'
  },
  {
    icon: Link,
    label: 'Ссылка'
  },
  {
    icon: Divider,
    label: 'Разделитель'
  },
])

const bottomsheetRef = ref<InstanceType<typeof Bottomsheet>>()

function setOpen(value: boolean) {
  bottomsheetRef.value?.setOpen(value)
}

defineExpose({ setOpen })
</script>
