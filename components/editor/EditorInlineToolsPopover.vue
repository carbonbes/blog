<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverPortal>
      <FadeTransition>
        <PopoverContent
          @openAutoFocus="(e) => e.preventDefault()"
          @focusOutside="(e) => e.preventDefault()"
          asChild
        >
          <div
            class="editor-inline-tools-popover"
            :style="floatingStyles"
            ref="popoverRef"
          >
            <template v-for="mark in marks">
              <button
                class="btn"
                :class="{ active: mark.active }"
                @click="mark.action"
                v-if="!mark.disabled"
              >
                <Component :is="mark.icon" />
              </button>
            </template>
          </div>
        </PopoverContent>
      </FadeTransition>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script lang="ts" setup>
import { offset, shift, useFloating } from '@floating-ui/vue'
import Bold from '~icons/tabler/bold'
import Italic from '~icons/tabler/italic'
import Strikethrough from '~icons/tabler/strikethrough'
import Underline from '~icons/tabler/underline'
import Link from '~icons/tabler/link'
import EyeOff from '~icons/tabler/eye-off'
import type { SVGIcon } from '~/types'

const isOpen = ref(false)

const { editor, selectionIsEmpty, selectionRect } = useEditor()

watch(selectionIsEmpty, (v) => {
  isOpen.value = v
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

const popoverRef = ref<HTMLDivElement>()

const { floatingStyles } = useFloating(selectionRect, popoverRef, {
  middleware: [shift(), offset(5)],
})

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
  isOpen.value = value
}

defineExpose({ setOpen })
</script>
