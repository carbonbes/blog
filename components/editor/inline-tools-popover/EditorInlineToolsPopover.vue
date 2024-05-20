<template>
  <Popover
    @openAutoFocus="(e) => e.preventDefault()"
    @focusOutside="(e) => e.preventDefault()"
    :style="floatingStyles"
    ref="popoverRef"
  >
    <Flex itemsCenter
      class="p-1 gap-1 bg-white shadow-lg ring-1 ring-gray-200 rounded-xl"
      ref="popoverBodyRef"
    >
      <template v-for="mark in marks">
        <Flex
          tag="button"
          class="p-1 rounded-lg hover:bg-gray-200 [&.active]:bg-blue-100 [&.active]:text-blue-500"
          :class="{ active: mark.active }"
          @click="mark.action"
          v-if="!mark.disabled"
        >
          <Component :is="mark.icon" />
        </Flex>
      </template>
    </Flex>
  </Popover>

  <EditorLinkInsertingDialog
    @complete="(link) => setLink(link)"
    @cancel="editor?.commands.focus()"
    @close="editor?.commands.focus()"
    ref="editorLinkInsertingDialogRef"
  />
</template>

<script lang="ts" setup>
import EditorLinkInsertingDialog from '~/components/editor/inline-tools-popover/EditorLinkInsertingDialog.vue'
import { offset, shift, useFloating } from '@floating-ui/vue'
import Bold from '~icons/tabler/bold'
import Italic from '~icons/tabler/italic'
import Strikethrough from '~icons/tabler/strikethrough'
import Underline from '~icons/tabler/underline'
import Link from '~icons/tabler/link'
import EyeOff from '~icons/tabler/eye-off'
import type { SVGIcon } from '~/types'
import type Popover from '~/components/global/Popover.vue'

const popoverRef = ref<typeof Popover>()

const { editor, selectionIsEmpty, selectionRect } = useEditor()

watch(selectionIsEmpty, (v) => {
  popoverRef.value?.setOpen(v)
})

const boldActive = computed(() => !!editor.value?.isActive('bold'))
const canSetBold = computed(() => editor.value?.can().setBold()!)
const italicActive = computed(() => !!editor.value?.isActive('italic'))
const canSetItalic = computed(() => editor.value?.can().setItalic()!)
const strikeActive = computed(() => !!editor.value?.isActive('strike'))
const canSetStrike = computed(() => editor.value?.can().setStrike()!)
const underlineActive = computed(() => !!editor.value?.isActive('underline'))
const canSetUnderline = computed(() => editor.value?.can().setUnderline()!)
const linkActive = computed(() => !!editor.value?.isActive('link'))
const canSetLink = computed(() => editor.value?.can().setLink()!)
const inlineSpoilerActive = computed(() => !!editor.value?.isActive('inlineSpoiler'))
const canSetInlineSpoiler = computed(() => editor.value?.can().toggleInlineSpoiler()!)

const popoverBodyRef = ref<HTMLDivElement>()

const { floatingStyles } = useFloating(selectionRect, popoverBodyRef, {
  middleware: [shift(), offset(5)]
})

const editorLinkInsertingDialogRef = ref()

const marks = computed<{
  action: () => void
  icon: SVGIcon
  active: boolean
  disabled: boolean
}[]>(() => ([
  {
    action: () => toggleBold(),
    icon: markRaw(Bold),
    active: boldActive.value,
    disabled: !canSetBold.value,
  },
  {
    action: () => toggleItalic(),
    icon: markRaw(Italic),
    active: italicActive.value,
    disabled: !canSetItalic.value,
  },
  {
    action: () => toggleStrikethrough(),
    icon: markRaw(Strikethrough),
    active: strikeActive.value,
    disabled: !canSetStrike.value,
  },
  {
    action: () => toggleUnderline(),
    icon: markRaw(Underline),
    active: underlineActive.value,
    disabled: !canSetUnderline.value,
  },
  {
    action: () => toggleLink(),
    icon: markRaw(Link),
    active: linkActive.value,
    disabled: !canSetLink.value
  },
  {
    action: () => toggleInlineSpoiler(),
    icon: markRaw(EyeOff),
    active: inlineSpoilerActive.value,
    disabled: !canSetInlineSpoiler.value,
  },
]))

function toggleBold() {
  editor.value?.chain().focus().toggleBold().run()
}

function toggleItalic() {
  editor.value?.chain().focus().toggleItalic().run()
}

function toggleStrikethrough() {
  editor.value?.chain().focus().toggleStrike().run()
}

function toggleLink() {
  !linkActive.value ? openLinkInsertingDialog() : unsetLink()
}

function openLinkInsertingDialog() {
  editorLinkInsertingDialogRef.value?.open()
}

function setLink(link: string) {
  if (!isValidURL(link)) {
    editor.value?.chain().focus().unsetLink().run()
    return
  }

  editor.value?.chain().focus().toggleLink({ href: link }).run()
}

function unsetLink() {
  editor.value?.chain().focus().unsetLink().run()
}

function toggleUnderline() {
  editor.value?.chain().focus().toggleUnderline().run()
}

function toggleInlineSpoiler() {
  editor.value?.chain().focus().toggleInlineSpoiler().run()
}

function setOpen(value: boolean) {
  popoverRef.value?.setOpen(value)
}

defineExpose({ setOpen })
</script>
