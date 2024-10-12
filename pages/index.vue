<template>
  <Flex justifyCenter class="sm:mt-8">
    <Flex col class="p-6 w-full max-w-[680px] gap-4 bg-white min-[680px]:rounded-lg">
      <h1 class="font-medium">
        Мои записи
      </h1>

      <Flex col>
        <Flex v-if="!articles?.data?.length" col itemsCenter class="gap-2 text-gray-500">
          У вас еще нет записей
          <UIButton class="flex items-center gap-2 font-medium" @click="openEditor">
            <ITablerPencil class="!w-5 !h-5" />
            Написать
          </UIButton>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})

const { user } = useMe()
const router = useRouter()
const route = useRoute()

const {
  data: articles,
  error
} = await useAsyncData('articles', async () => await getProfileArticles(user.value!.user_id))

if (error.value)
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.message,
  })

function openEditor() {
  router.push({ path: route.path, query: { dialog: 'editor' }, replace: true })
}
</script>
