<template>
  <div class="sm:py-8">
    <Article :article />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const articleId = computed(() => route.params.id as unknown as number)

const { article, getArticle } = useArticlePage()

await useAsyncData(async () => {
  await getArticle(articleId.value)

  return true
})

useSeoMeta({
  title: article.value?.title,
})

onMounted(() => {
  if (!article.value) return

  const articleURL = getArticleURL(article.value)
  navigateTo({ path: articleURL, query: route.query }, { replace: true })
})
</script>
