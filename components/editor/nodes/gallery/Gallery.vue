<template>
  <NodeViewWrapper
    class="flex flex-col"
    :class="{ 'p-2 sm:p-4 bg-gray-100 rounded-xl': isEmpty || !isSingle }"
    data-type="gallery"
    contenteditable="false"
  >
    <Flex col class="relative">
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

      <Flex
        v-else
        class="relative"
        :class="{ 'gap-4 flex-wrap': !isSingle }"
      >
        <div v-for="(image, i) in images" :key="i" class="relative">
          <Image
            :src="image.src"
            zoomable
            class="w-full max-h-80 bg-gray-200 rounded-lg overflow-hidden"
            :class="{ 'w-20 h-full max-h-20 flex justify-center shadow-lg [&_>img]:h-full': !isSingle }"
          />
          <button
            class="absolute top-[-10px] right-[-10px] p-1 bg-white border border-gray-100 rounded-full group/remove-btn"
            @click="remove(i)"
          >
            <ITablerX class="!size-3 group-hover/remove-btn:text-red-500 transition-colors" />
          </button>
        </div>
      </Flex>

      <Flex class="gap-2" :class="{ 'mt-10': isMany, 'absolute left-0 bottom-0': isSingle }">
        <UIButton size="s" @click="open">
          <ITablerPlus />
        </UIButton>

        <UIButton size="s" @click="dialogRef?.setOpen(true)">
          <ITablerLink />
        </UIButton>
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

const isEmpty = computed(() => !props.node.attrs.images.length)
const isSingle = computed(() => props.node.attrs.images.length === 1)
const isMany = computed(() => props.node.attrs.images.length > 1)

const FILE_MAX_SIZE = 1024 * 1024 * 10

const images = ref<{
  id?: string
  src?: string
  loading?: boolean
}[]>(props.node.attrs.images)

const dialogRef = ref<InstanceType<typeof Dialog>>()

const imageUrl = ref('')

watch(imageUrl, async (v) => {
  if (!v || !isValidImageURL(v)) return

  dialogRef.value?.setOpen(false)
  await uploadImage(v)
  imageUrl.value = ''
})

const { reset, open, onChange } = useFileDialog({
  accept: 'image/png, image/webp, image/jpg, image/jpeg, image/heic, image/gif',
})

const { add } = useNotifications()

onChange(async (files) => {
  if (!files) return

  const images = Array.from(files)

  await uploadImages(images)

  reset()
})

async function uploadImages(files: File[]) {
  await Promise.all(
    Object.values(files).map(async (file) => {
      if (file.size > FILE_MAX_SIZE) {
        add({
          type: 'error',
          title: 'Ошибка',
          text: 'Слишком большой файл',
        })

        return
      }

      const id = window.crypto.randomUUID()

      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        images.value.push({
          id,
          src: fileReader.result as string,
          loading: true,
        })
      }

      try {
        const {
          data: { secure_url },
        } = await uploadMediaByFile(file)

        const i = images.value.findIndex((image) => image.id === id)

        images.value[i].src = secure_url

        delete images.value[i].id
        delete images.value[i].loading
      } catch (error: any) {
        const i = images.value.findIndex((image) => image.id === id)
        images.value.splice(i, 1)

        props.updateAttributes({
          images: images.value,
        })

        add({
          type: 'error',
          title: 'Ошибка',
          text: error.data.message,
        })
      } finally {
        reset()
      }
    })
  )

  props.updateAttributes({
    images: images.value,
    forUpload: [],
  })
}

async function uploadImage(imageUrl: string) {
  const id = window.crypto.randomUUID()

  images.value.push({ id, src: imageUrl, loading: true })

  try {
    const {
      data: { secure_url },
    } = await uploadMediaByUrl(imageUrl)

    const i = images.value.findIndex((image) => image.id === id)

    images.value[i].src = secure_url

    delete images.value[i].id
    delete images.value[i].loading

    props.updateAttributes({
      images: images.value,
      forUpload: [],
    })
  } catch (error: any) {
    const i = images.value.findIndex((image) => image.id === id)
    images.value.splice(i, 1)

    props.updateAttributes({
      images: images.value,
    })

    add({
      type: 'error',
      title: 'Ошибка',
      text: error.data.message,
    })
  } finally {
    reset()
  }
}

function remove(i: number) {
  images.value.splice(i, 1)
  props.updateAttributes({ images: images.value })
}

onMounted(async () => {
  const files: File[] | string = props.node.attrs.forUpload

  if (!files.length) return

  if (typeof files === 'string') {
    await uploadImage(files)
  } else {
    await uploadImages(files)
  }
})
</script>
