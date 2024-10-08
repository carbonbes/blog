<template>
  <Flex
    v-if="!(item.subitems || item.hide)"
    tag="button"
    itemsCenter
    class="py-1.5 px-2.5 w-full gap-3 rounded-lg hover:bg-gray-200/75 [&.active]:bg-blue-100 [&.active]:text-blue-500 disabled:pointer-events-none disabled:opacity-50 transition-colors"
    :class="[item.class, { active: item.active }]"
    :disabled="item.disabled"
    @click="item.action"
  >
    <Component :is="item.icon" class="!size-5" />
    {{ item.label }}
  </Flex>

  <DropdownMenuSub v-else-if="item.subitems && !item.hide">
    <DropdownMenuSubTrigger asChild>
      <Flex
        tag="button"
        itemsCenter
        class="py-1.5 px-2.5 w-full gap-3 rounded-lg hover:bg-gray-200/75 [&.active]:bg-blue-100 data-[state=open]:bg-blue-50 [&.active]:text-blue-500 disabled:pointer-events-none disabled:opacity-50 transition-colors"
        :class="[item.class, { active: item.active }]"
        :disabled="item.disabled"
        @click="item.action"
      >
        <Component :is="item.icon" class="!size-5" />
        {{ item.label }}
        <ITablerChevronRight class="ml-auto !size-4 text-gray-500" />
      </Flex>
    </DropdownMenuSubTrigger>

    <DropdownMenuPortal>
      <FadeInOpacityTransition>
        <DropdownMenuSubContent :side-offset="5" asChild>
          <DropdownBody :items="item.subitems!" />
        </DropdownMenuSubContent>
      </FadeInOpacityTransition>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>

<script lang="ts" setup>
import type { DropdownItem } from '~/types'

defineProps<{
  class?: string | object
  item: DropdownItem
}>()
</script>
