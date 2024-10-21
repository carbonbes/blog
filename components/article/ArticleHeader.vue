<template>
  <Flex justifyBetween>
    <Flex class="gap-4">
      <p class="font-medium">{{ article.author.name }}</p>
      <DateTime :dateTime="article.created_at" class="text-gray-500" />
    </Flex>

    <Dropdown :collisionPadding="10" :items ref="dropdownRef">
      <button class="hover:opacity-50 transition-opacity duration-[250ms]">
        <ITablerDots />
      </button>
    </Dropdown>
  </Flex>
</template>

<script lang="ts" setup>
import type { Article } from '~/types'
import Pencil from '~icons/tabler/pencil'
import type Dropdown from '~/components/global/dropdown/Dropdown.vue'

const props = defineProps<{
  article: Article
}>()

const { setOpen } = useEditorDialog()

const dropdownRef = ref<InstanceType<typeof Dropdown>>()

const items = computed(() => [
  {
    icon: Pencil,
    label: 'Редактировать',
    action: async () => {
      await setOpen(true, {
        id: props.article.id,
        title_slug: props.article.title_slug,
      })

      dropdownRef.value?.setOpen(false)
    },
  },
])
</script>
