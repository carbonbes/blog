<template>
  <NodeViewWrapper
    class="p-2 sm:p-4 flex flex-col bg-gray-100"
    :class="{ 'border-2 border-gray-200 rounded-xl': isEmpty || !isSingle }"
    data-type="gallery"
    contenteditable="false"
  >
    <Flex col>
      <Flex v-if="isEmpty" col itemsCenter class="gap-8">
        <ITablerPhoto class="!size-10" />
        
        <Flex class="gap-2">
          <UIButton @click="open">
            Выбрать файлы
          </UIButton>

          <UIButton @click="dialogRef?.setOpen(true)">
            Вставить по ссылке
          </UIButton>
        </Flex>
      </Flex>

      
    </Flex>
  </NodeViewWrapper>

  <Dialog ref="dialogRef">
    <UITextArea autofocus placeholder="Ссылка" v-model="imageUrl" />
  </Dialog>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import type Dialog from '~/components/global/Dialog.vue'

const props = defineProps<NodeViewProps>()

const imageUrl = ref('')

const dialogRef = ref<InstanceType<typeof Dialog>>()

const isEmpty = computed(() => !props.node.attrs.images.length)
const isSingle = computed(() => props.node.attrs.images.length === 1)

const { reset, open, onChange } = useFileDialog({
  accept: 'image/png, image/webp, image/jpg, image/jpeg, image/heic, image/gif',
})
</script>
