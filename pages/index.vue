<template>
  <Flex col justifyCenter class="py-8 w-full gap-4">
    <h1 class="px-6 text-lg font-medium">Мои черновики</h1>

    <PaginatedContent
      v-if="articles?.length"
      :page
      :totalPages
      :pending
      @nextPage="onNextPage"
      class="flex flex-col gap-6"
    >
      <ArticleCard v-for="article in articles" :article />
    </PaginatedContent>

    <Flex
      v-else
      col
      itemsCenter
      class="p-4 bg-white gap-6 text-gray-500 rounded-xl"
    >
      <Flex col itemsCenter class="gap-2">
        <ITablerArticle />
        У вас еще нет записей
      </Flex>

      <Flex col itemsCenter>
        <UIButton
          class="flex items-center gap-2 font-medium rounded-xl"
          @click="openEditor"
        >
          <ITablerPencil class="!size-5" />
          Написать
        </UIButton>
      </Flex>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'IndexPage',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Мои черновики',
})

const { pending, articles, total, getArticles } = useMyArticlesPage()

const page = ref(1)

const totalPages = computed(() =>
  Math.ceil(total.value / PROFILE_PAGE_ARTICLES_PAGE_SIZE)
)

await useAsyncData(async () => {
  await getArticles(page.value)

  return true
})

const { errorToastify } = useToasts()

const onNextPage = useDebounceFn(
  async () => {
    try {
      await getArticles(page.value + 1)
      page.value += 1
    } catch (error) {
      errorToastify({ text: 'Не удалось загрузить следующую страницу' })
    }
  },
  1250,
  { maxWait: 60000 }
)

const { setOpen } = useEditorDialog()

function openEditor() {
  setOpen(true)
}
</script>
