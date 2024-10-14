<template>
  <Dialog
    class="fixed inset-0 w-full h-full max-w-[780px] sm:max-h-[800px] !rounded-none sm:!rounded-xl"
    @close="setOpen(false)"
    ref="dialogRef"
  >
    <Editor :data="article?.body" @update="onUpdate" />

    <template #footer>
      <EditorPanel @save="onSave" />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'
import type Editor from '~/components/editor/Editor.client.vue'
import type {
  ArticleBody,
  GalleryNode,
  HeadingNode,
  ListNode,
  ParagraphNode,
} from '~/schema/articleBodySchema'
import getArticleURL from '~/utils/getPostUrl'
import { isEqual } from 'lodash'

const dialogRef = ref<InstanceType<typeof Dialog>>()

const { editor } = useEditor()
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

const onUpdate = useDebounceFn(async (body: ArticleBody) => {
  const processedBody = {
    type: 'doc',
    content: filterEmptyNodes(body.content),
  } as ArticleBody

  if (!article.value) {
    article.value = await create(processedBody)
  } else {
    if (isEqual(article.value.body, processedBody)) return

    article.value = await update(article.value.id, processedBody)
  }
}, 500)

const { successNotify, errorNotify } = useNotifications()

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

function filterEmptyNodes(content: ArticleBody['content']) {
  return content.filter((rootNode) => {
    const [node] = rootNode.content

    if (['heading', 'paragraph'].includes(node.type)) {
      const [textNode] = (node as HeadingNode | ParagraphNode).content || []

      if (!textNode || !textNode.text.trim()) return false
    }

    if (['bulletList', 'orderedList'].includes(node.type)) {
      const listNode = node as ListNode

      listNode.content = listNode.content.filter((listItem) => {
        const [paragraphNode] = listItem.content
        const [textNode] = paragraphNode.content || []

        return textNode && textNode.text?.trim()
      })

      if (!listNode.content.length) return false
    }

    if (node.type === 'gallery') {
      const items = (node as GalleryNode).attrs.items

      if (!items.length) return false
    }

    return true
  })
}

const onSave = useThrottleFn(async () => {
  const body = editor.value?.getJSON() as ArticleBody

  const processedBody = {
    type: 'doc',
    content: filterEmptyNodes(body.content),
  } as ArticleBody

  try {
    await update(+articleId.value!, processedBody)
    successNotify({ text: 'Запись сохранена' })
  } catch (error) {}
}, 2000)

onMounted(() => {
  if (!article.value) return

  const articleURL = getArticleURL(article.value)
  navigateTo(articleURL, { replace: true })
})
</script>
