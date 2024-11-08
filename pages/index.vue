<template>
  <Flex col justifyCenter class="py-8 w-full gap-4">
    <h1 class="px-6 text-lg font-medium">Мои записи</h1>

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
  title: 'Мои записи',
})

const { user } = useUser()
const { pending, articles, getProfileArticles } = useArticlesPage()

const page = ref(1)
const totalPages = ref(Math.ceil(user.value?.articles! / 10))

await useAsyncData(async () => {
  await getProfileArticles(page.value)

  return true
})

async function onNextPage() {
  await getProfileArticles(page.value + 1)
  page.value += 1
}

const { setOpen } = useEditorDialog()

function openEditor() {
  setOpen(true)
}
</script>
