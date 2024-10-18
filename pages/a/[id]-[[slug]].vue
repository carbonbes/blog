<template>
  <ArticleHeader :article />
  <ArticleContent :article />
</template>

<script lang="ts" setup>
import getArticleURL from '~/utils/getArticleURL'

const route = useRoute()

const articleId = computed(() => route.params.id as unknown as number)

const { article, getArticle } = useArticlePage()

await useAsyncData(async () => await getArticle(articleId.value))

onMounted(() => {
  if (!article.value) return

  const articleURL = getArticleURL(article.value)
  navigateTo(articleURL, { replace: true })
})
</script>
