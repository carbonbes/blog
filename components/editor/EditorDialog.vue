<template>
  <Dialog
    class="w-full h-full max-w-[780px] sm:max-h-[800px] !rounded-none"
    :class="dialogClasses"
    :closeCallback="onCloseDown"
    v-model:open="isOpen"
    @interactOutside="showConfirmationDialog"
    @escapeKeyDown="showConfirmationDialog"
  >
    <template v-if="state.isReady" #left-header>
      <EditorActionsPanel class="sm:hidden" @save="onSave" />
    </template>

    <template #right-header>
      <Tooltip :tooltip="state.isExpand ? 'Свернуть' : 'Развернуть'">
        <button
          class="hover:opacity-50 transition-opacity"
          @click="toggleExpand"
        >
          <ITablerArrowsDiagonal v-if="!state.isExpand" class="hidden sm:block" />
          <ITablerArrowsDiagonalMinimize2 v-else class="hidden sm:block" />
        </button>
      </Tooltip>
    </template>

    <FadeInOpacityTransition>
      <Flex v-if="articleId && !article" center class="absolute inset-0">
        <Loader color="!bg-black" />
      </Flex>

      <Flex
        v-else
        col
        class="w-full h-full overflow-hidden [&_.editor]:sm:mx-auto [&_.editor]:sm:max-w-[748px]"
      >
        <Editor
          :data="article?.body"
          :manualInit="!!articleId"
          @ready="state.isReady = true"
          @update="onUpdate"
          ref="editorRef"
        />
      </Flex>
    </FadeInOpacityTransition>

    <template v-if="state.isReady" #footer>
      <Flex class="sm:mx-auto w-full sm:max-w-[748px]">
        <EditorHistoryActions class="sm:hidden" />
        <EditorActionsPanel class="ml-auto hidden sm:flex" @save="onSave" />
      </Flex>
    </template>
  </Dialog>

  <Dialog
    v-model:open="confirmationDialogInOpen"
    class="w-full max-w-[400px] rounded-none min-[400px]:rounded-xl"
  >
    <Flex col class="gap-8">
      <Flex col class="gap-2">
        <ITablerAlertTriangle class="mx-auto !size-10 text-red-500" />
        <p class="text-lg font-bold text-center">
          Вы действительно хотите закрыть редактор?
        </p>
        <p class="text-gray-500 text-center">
          Сохраняющиеся изменения в данный момент будут утеряны
        </p>
      </Flex>

      <Flex justifyBetween class="w-full gap-4">
        <UIButton
          class="flex-1"
          @click="
            confirmationDialogInOpen = false;
            isOpen = false
          "
        >
          Да
        </UIButton>
        <UIButton
          variant="secondary"
          class="flex-1"
          @click="confirmationDialogInOpen = false"
        >
          Нет
        </UIButton>
      </Flex>
    </Flex>
  </Dialog>
</template>

<script lang="ts" setup>
import type {
  ArticleBody,
  GalleryNode,
  HeadingNode,
  ListNode,
  ParagraphNode,
} from '~/types'
import { isEqual } from 'lodash'
import type Editor from '~/components/editor/Editor.client.vue'
import { promiseTimeout } from '@vueuse/core'

const { $api } = useNuxtApp()

const isExpand = useCookie('editor-dialog/is-expand')

const state = reactive({
  isReady: false,
  isExpand: isExpand.value,
  enableTransition: false
})

const dialogClasses = computed(() => ({
  'sm:!rounded-xl': !state.isExpand,
  'max-w-full sm:max-h-full sm:!rounded-none': state.isExpand,
  'sm:transition-[max-width,max-height,border-radius] sm:duration-200': state.enableTransition
}))

const editorRef = ref<InstanceType<typeof Editor>>()

const { editor } = useEditor()

const {
  isOpen,
  confirmationDialogInOpen,
  pending,
  uploading,
  article,
  getArticle,
} = useEditorDialog()

const route = useRoute()

const articleId = computed(
  () => route.query.id as unknown as number | undefined
)

watch(
  isOpen,
  (v) => {
    if (v) onOpen()
    else onClose()
  },
  { immediate: true }
)

async function onOpen() {
  state.isExpand = isExpand.value

  if (article.value) {
    const articleURL = getArticleEditorURL(article.value)
    navigateTo(articleURL, { replace: true })
  }

  if (articleId.value) {
    await getArticle(articleId.value)
    editorRef.value?.manualInit()
  }
}

async function onClose() {
  pending.value = false
  uploading.value = false
  article.value = undefined
  await promiseTimeout(200)
  state.isExpand = false
}

const onUpdate = useDebounceFn(async (body: ArticleBody) => {
  const processedBody = {
    type: 'doc',
    content: filterEmptyNodes(body.content),
  } as ArticleBody

  if (!processedBody.content.length) return

  if (!article.value) {
    if (isEqual(body, processedBody)) return

    article.value = await create(processedBody)
  } else {
    if (isEqual(article.value.body, processedBody)) return

    article.value = await update(article.value.id, processedBody)
  }
}, 500)

const { errorToastify } = useToasts()

async function create(body: ArticleBody) {
  try {
    pending.value = true

    const newArticle = await $api.createArticle(body)

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
    errorToastify({
      text: error.data.message,
    })
  } finally {
    pending.value = false
  }
}

async function update(articleId: number, body: ArticleBody) {
  try {
    pending.value = true

    const updatedArticle = await $api.updateArticle(articleId, body)

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
    errorToastify({
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

    if (node.type === 'sn-embed') {
      if (!node.attrs.embed) return false
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

  if (!processedBody.content.length) return

  await update(+articleId.value!, processedBody)
}, 2000)

function showConfirmationDialog(e: Event) {
  if (pending.value || uploading.value) {
    e.preventDefault()
    confirmationDialogInOpen.value = true
  }
}

function onCloseDown() {
  if (pending.value || uploading.value) {
    confirmationDialogInOpen.value = true
  } else {
    isOpen.value = false
  }
}

useEventListener('beforeunload', (e) => {
  if (pending.value || uploading.value) {
    e.preventDefault()

    return false
  }
})

async function toggleExpand() {
  state.enableTransition = true
  state.isExpand = !state.isExpand
  isExpand.value = !isExpand.value
  await promiseTimeout(200)
  state.enableTransition = false
}
</script>
