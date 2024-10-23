<template>
  <Flex col justifyCenter class="py-8 w-full gap-4">
    <h1 class="px-6 text-lg font-medium">Мои записи</h1>

    <Flex v-if="articles" col class="gap-6">
      <ArticleCard v-for="article in articles" :article />
    </Flex>

    <Flex
      v-else
      col
      itemsCenter
      class="p-4 bg-white gap-2 text-gray-500 rounded-xl"
    >
      <ITablerArticle />
      У вас еще нет записей
      <UIButton class="flex items-center gap-2 font-medium" @click="openEditor">
        <ITablerPencil class="!size-5" />
        Написать
      </UIButton>
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

const { user } = useMe()

const { data: articles, error } = await useAsyncData(
  async () => await getProfileArticles(user.value!.id)
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.message,
  })
}

const { setOpen } = useEditorDialog()

function openEditor() {
  setOpen(true)
}
</script>
