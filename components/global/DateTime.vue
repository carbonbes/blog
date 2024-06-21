<template>
  <div>{{ dateTimeDisplay }}</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  dateTime: number | string
  format?: string
}>()

const dayjs = useDayjs()

// const format = computed(() => {
//   const day = dayjs(props.dateTime).day()

//   if (day )
// })

const dateTimeDisplay = dayjs(props.dateTime).format('DD.MM.YYYY')
</script>
