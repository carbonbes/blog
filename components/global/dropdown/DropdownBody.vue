<template>
   <div class="p-1 bg-white ring-1 ring-gray-100 shadow-lg rounded-xl">
    <ScrollArea>
      <Flex col class="!flex gap-1" :style="{ maxHeight }">
        <template v-for="item in items">
          <Flex
            tag="button"
            itemsCenter
            class="py-1.5 px-2.5 w-full gap-3 rounded-lg hover:bg-gray-200/75 [&.active]:bg-blue-100 [&.active]:text-blue-500 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            :class="{ active: item.active }"
            :disabled="item.disabled"
            @click="item.action"
            v-if="!(item.subitems || item.separator || item.hide)"
          >
            <Component :is="item.icon" class="!w-5 !h-5" />
            {{ item.label }}
          </Flex>

          <DropdownMenuSeparator
            class="mx-2.5 h-[1px] bg-gray-200"
            v-else-if="item.separator"
          />

          <DropdownMenuSub v-else-if="item.subitems || !item.hide">
            <DropdownMenuSubTrigger asChild>
              <Flex
                tag="button"
                itemsCenter
                class="py-1.5 px-2.5 w-full gap-3 rounded-lg hover:bg-gray-200/75 [&.active]:bg-blue-100 data-[state=open]:bg-blue-50 [&.active]:text-blue-500 disabled:pointer-events-none disabled:opacity-50 transition-colors"
                :class="{ active: item.active }"
                :disabled="item.disabled"
                @click="item.action"
              >
                <Component :is="item.icon" class="!w-5 !h-5" />
                {{ item.label }}
                <ITablerChevronRight class="ml-auto !w-4 !h-4 text-gray-500" />
              </Flex>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <FadeInOpacityTransition>
                <DropdownMenuSubContent
                  :side-offset="5"
                  asChild
                >
                  <DropdownBody :items="item.subitems!" />
                </DropdownMenuSubContent>
              </FadeInOpacityTransition>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </template>
      </Flex>
    </ScrollArea>
  </div>
</template>

<script lang="ts" setup>
import type { DropdownItem } from '~/types'

defineProps<{
  maxHeight?: string
  items: DropdownItem[]
}>()
</script>
