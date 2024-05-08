<template>
  <input :type :placeholder :disabled :class="classes" v-model="model" ref="inputRef" />
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    type?: 'text' | 'number' | 'email' | 'password'
    size?: 's' | 'm' | 'l'
    placeholder?: string
    autofocus?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'text',
    size: 'm',
  }
)

const classes = computed(() => ({
  'bg-white rounded placeholder:text-gray-400 hover:outline-blue-300 focus:outline-blue-500 outline-none transition-all': true,
  'p-0.25 text-sm': props.size === 's',
  'p-0.5': props.size === 'm',
  'p-1': props.size === 'l',
}))

const model = defineModel()

const inputRef = ref<HTMLInputElement>()

onMounted(async () => {
  await nextTick()

  if (props.autofocus) inputRef.value?.focus()
})
</script>
