<template>
  <Dialog
    class="fixed inset-0 w-full h-full max-w-[780px] sm:max-h-[800px] !rounded-none sm:!rounded-xl"
    @close="setOpen(false)"
    ref="dialogRef"
  >
    <Editor :data="article?.body" @update="updateHandler" />

    <template #footer>
      <EditorPanel />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'
import type Editor from '~/components/editor/Editor.client.vue'
import type { ArticleBody } from '~/types'
import getArticleURL from '~/utils/getPostUrl'

const dialogRef = ref<InstanceType<typeof Dialog>>()

const { setOpen, state } = useEditorDialog(dialogRef)

const route = useRoute()

const articleId = computed(
  () => route.query.id as unknown as number | undefined
)

const { data: article, error } = await useAsyncData(async () =>
  articleId.value ? await getArticle(articleId.value) : undefined
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    message: error.value.message,
  })
}

const updateHandler = useDebounceFn(async (body: ArticleBody) => {
  if (!article.value) {
    article.value = await create(body)
  } else {
    article.value = await update(article.value.id, body)
  }
}, 500)

const { errorNotify } = useNotifications()

async function create(body: ArticleBody) {
  state.value.pending = true

  try {
    const newArticle = await createArticle(body)

    if (!newArticle) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось создать пост',
      })
    }

    const articleURL = getArticleURL(newArticle)
    navigateTo(articleURL, { replace: true })

    return newArticle
  } catch (error: any) {
    errorNotify({
      text: error.data.message,
    })
  } finally {
    state.value.pending = false
  }
}

async function update(articleId: number, body: ArticleBody) {
  state.value.pending = true
  try {
    const updatedArticle = await updateArticle(articleId, body)

    if (!updatedArticle) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось обновить пост',
        fatal: false,
      })
    }

    const articleURL = getArticleURL(updatedArticle)
    navigateTo(articleURL, { replace: true })

    return updatedArticle
  } catch (error: any) {
    errorNotify({
      text: error.data.message,
    })
  } finally {
    state.value.pending = false
  }
}

onMounted(() => {
  if (!article.value) return

  const articleURL = getArticleURL(article.value)
  navigateTo(articleURL, { replace: true })
})
</script>
