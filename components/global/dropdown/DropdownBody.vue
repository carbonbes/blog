<template>
  <div class="p-1 bg-white ring-1 ring-gray-100 shadow-lg rounded-xl z-[2]">
    <ScrollArea>
      <Flex col class="!flex gap-1" :style="{ maxHeight }">
        <template v-for="item in items">
          <Flex v-if="item.group" col class="gap-1">
            <Flex col class="relative gap-1">
              <DropdownBodyItem
                v-for="groupItem in item.group"
                :item="groupItem"
              />
            </Flex>

            <Separator class="mx-2.5 h-[1px] bg-gray-200/75" />
          </Flex>

          <DropdownBodyItem v-else :item />
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
