<template>
  <Dialog
    class="w-full h-full max-w-[780px] sm:max-h-[800px] !rounded-none sm:!rounded-xl"
    @open="onOpen"
    @close="onClose"
    ref="dialogRef"
  >
    <template v-if="isReady" #header>
      <EditorActionsPanel class="sm:hidden" @save="onSave" />
    </template>

    <FadeInOpacityTransition>
      <Flex v-if="articleId && !article" center class="absolute inset-0">
        <Loader color="!bg-black" />
      </Flex>

      <Flex v-else col class="h-full overflow-hidden">
        <Editor
          :data="article?.body"
          :manualInit="!!articleId"
          @ready="isReady = true"
          @update="onUpdate"
          ref="editorRef"
        />
      </Flex>
    </FadeInOpacityTransition>

    <template v-if="isReady" #footer>
      <Flex class="w-full">
        <EditorHistoryActions class="sm:hidden" />
        <EditorActionsPanel class="ml-auto hidden sm:flex" @save="onSave" />
      </Flex>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'
import type {
  ArticleBody,
  GalleryNode,
  HeadingNode,
  ListNode,
  ParagraphNode,
} from '~/schema/articleBodySchema'
import { isEqual } from 'lodash'
import type Editor from '~/components/editor/Editor.client.vue'

const dialogRef = ref<InstanceType<typeof Dialog>>()
const editorRef = ref<InstanceType<typeof Editor>>()

const isReady = ref(false)

const { editor } = useEditor()
const { setOpen } = useEditorDialog(dialogRef)
const { pending, article, requestArticle } = useEditorDialogArticle()

const route = useRoute()

const articleId = computed(
  () => route.query.id as unknown as number | undefined
)

async function onOpen() {
  if (article.value) {
    const articleURL = getArticleEditorURL(article.value)
    navigateTo(articleURL, { replace: true })
  }

  if (articleId.value) {
    await requestArticle(articleId.value)
    editorRef.value?.manualInit()
  }
}

function onClose() {
  setOpen(false)
  article.value = undefined
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

const { errorNotify } = useNotifications()

async function create(body: ArticleBody) {
  pending.value = true

  try {
    const newArticle = await createArticle(body)

    if (!newArticle) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось создать пост',
      })
    }

    const articleURL = getArticleEditorURL(newArticle)
    navigateTo(articleURL, { replace: true })

    return newArticle
  } catch (error: any) {
    errorNotify({
      text: error.data.message,
    })
  } finally {
    pending.value = false
  }
}

async function update(articleId: number, body: ArticleBody) {
  pending.value = true

  try {
    const updatedArticle = await updateArticle(articleId, body)

    if (!updatedArticle) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось обновить пост',
        fatal: false,
      })
    }

    const articleURL = getArticleEditorURL(updatedArticle)
    navigateTo(articleURL, { replace: true })

    return updatedArticle
  } catch (error: any) {
    errorNotify({
      text: error.data.message,
    })
  } finally {
    pending.value = false
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

  await update(+articleId.value!, processedBody)
}, 2000)
</script>
