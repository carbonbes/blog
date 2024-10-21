<template>
  <div class="sm:my-8">
    <ArticleCard :article />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const articleId = computed(() => route.params.id as unknown as number)

const { article, getArticle } = useArticlePage()

await useAsyncData(async () => await getArticle(articleId.value))

onMounted(() => {
  if (!article.value) return

  const articleURL = getArticleURL(article.value)
  navigateTo({ path: articleURL, query: route.query }, { replace: true })
})
</script>
