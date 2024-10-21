<template>
  <Flex
    itemsCenter
    justifyBetween
    class="fixed bottom-0 sm:sticky sm:top-0 sm:bottom-[unset] w-full px-6 h-[60px] bg-white sm:shadow-sm"
  >
    <NuxtLoadingIndicator class="!absolute !top-full" />

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
      v-if="isAuthenticated"
      variant="secondary"
      size="s"
      class="!p-2.5 sm:hidden !rounded-full"
      @click="openEditor"
    >
      <ITablerPencil />
    </UIButton>

    <Flex class="gap-4">
      <UIButton
        variant="secondary"
        size="s"
        class="hidden sm:flex items-center gap-2"
        @click="openEditor"
      >
        <ITablerPencil class="!size-5" />
      </UIButton>

      <Flex v-if="isAuthenticated" itemsCenter class="gap-2">
        <ITablerUserCircle />
      </Flex>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
const route = useRoute()
const isIndexPage = computed(() => route.name === 'IndexPage')

const { setOpen } = useEditorDialog()
function openEditor() {
  setOpen(true)
}

const { isAuthenticated, user, logoutMe } = useMe()
</script>
