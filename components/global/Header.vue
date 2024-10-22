<template>
  <Flex
    v-if="isAuthenticated"
    class="fixed bottom-0 sm:sticky sm:top-0 sm:bottom-[unset] w-full px-6 h-[60px] bg-white border border-t-gray-100 sm:border-none sm:shadow-sm z-[1]"
  >
    <NuxtLoadingIndicator
      class="!absolute !top-[-3px] sm:!top-full !bg-[repeating-linear-gradient(to_right,rgb(237,34,36),rgb(243,91,34),rgb(249,150,33),rgb(245,193,30),rgb(241,235,27)27%,rgb(241,235,27),rgb(241,235,27)_33%,rgb(99,199,32),rgb(12,155,73),rgb(33,135,141),rgb(57,84,165),rgb(97,55,155),rgb(147,40,142))]"
    />

    <Flex itemsCenter justifyBetween class="w-full sm:mx-auto sm:max-w-[640px]">
      <Tooltip tooltip="На главную">
        <button
          class="hover:opacity-50 transition-opacity duration-[250ms] disabled:pointer-events-none"
          :class="{ 'text-blue-500': isIndexPage }"
          :disabled="isIndexPage"
        >
          <NuxtLink :to="{ name: 'IndexPage' }">
            <ITablerHome />
          </NuxtLink>
        </button>
      </Tooltip>

      <UIButton
        variant="secondary"
        size="s"
        class="!p-2.5 sm:hidden !rounded-full"
        @click="openEditor"
      >
        <ITablerPencil />
      </UIButton>

      <Flex class="gap-4">
        <Tooltip tooltip="Новая запись">
          <UIButton
            size="s"
            class="hidden sm:flex items-center gap-2"
            @click="openEditor"
          >
            <ITablerPencil class="!size-5" />
          </UIButton>
        </Tooltip>

        <Flex itemsCenter class="gap-2">
          <ITablerUserCircle />
        </Flex>
      </Flex>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
const route = useRoute()

const isIndexPage = computed(() => route.name === 'IndexPage')

const { isAuthenticated } = useMe()

const { setOpen } = useEditorDialog()

function openEditor() {
  setOpen(true)
}
</script>
