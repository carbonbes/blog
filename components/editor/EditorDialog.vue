<template>
  <Dialog
    class="w-full h-full max-w-[780px] sm:max-h-[800px] !rounded-none sm:!rounded-xl"
    footerClass="sm:justify-end"
    @open="onOpen"
    @close="onClose"
    ref="dialogRef"
  >
    <FadeInOpacityTransition>
      <Flex v-if="!article" center class="h-full">
        <Loader color="!bg-black" />
      </Flex>

      <Flex v-else col class="overflow-hidden">
        <template #header>
          <EditorPanel class="sm:hidden flex-row-reverse" @save="onSave" />
        </template>

        <Editor
          :data="article?.body"
          manualInit
          @update="onUpdate"
          ref="editorRef"
        />

        <template #footer>
          <Flex itemsCenter justifyBetween class="w-full">
            <p
              v-if="article"
              class="px-3 py-1 self-end bg-red-400 text-sm font-medium text-white rounded-full"
            >
              {{ status }}
            </p>

            <EditorPanel class="hidden sm:flex" @save="onSave" />
          </Flex>
        </template>
      </Flex>
    </FadeInOpacityTransition>
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
import getArticleURL from '~/utils/getPostUrl'
import { isEqual } from 'lodash'
import type Editor from '~/components/editor/Editor.client.vue'

const dialogRef = ref<InstanceType<typeof Dialog>>()
const editorRef = ref<InstanceType<typeof Editor>>()

const { editor } = useEditor()
const { setOpen } = useEditorDialog(dialogRef)
const { pending, article, requestArticle } = useEditorDialogArticle()

const route = useRoute()

const articleId = computed(
  () => route.query.id as unknown as number | undefined
)

async function onOpen() {
  if (articleId.value) {
    await requestArticle(articleId.value)
    editorRef.value?.manualInit()
  }
}

function onClose() {
  setOpen(false)
  article.value = undefined
}

const status = computed(() => {
  if (!article.value) return

  const statuses = {
    draft: 'Черновик',
    published: 'Опубликован',
    scheduled: 'Запланирован',
  }

  return statuses[article.value.status]
})

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

    const articleURL = getArticleURL(newArticle)
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

    const articleURL = getArticleURL(updatedArticle)
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

onMounted(() => {
  if (!article.value) return

  const articleURL = getArticleURL(article.value)
  navigateTo(articleURL, { replace: true })
})
</script>
