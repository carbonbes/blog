<template>
  <Flex col class="gap-6">
    <ArticleCard v-for="article in drafts" :article />
  </Flex>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Мои черновики',
})

const { user } = useMe()

const { data: drafts, error } = await useAsyncData(
  async () => await getProfileDrafts(user.value!.id)
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.message,
  })
}
</script>
