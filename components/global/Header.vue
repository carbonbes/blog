<template>
  <Flex
    v-if="isAuthenticated"
    id="header"
    class="fixed sm:top-0 bottom-0 sm:bottom-[unset] px-6 w-full h-[var(--header-height)] bg-white -shadow-sm sm:shadow-sm z-[2]"
  >
    <Html :style="'--header-height: 60px'" />

    <NuxtLoadingIndicator
      class="!absolute !top-[-3px] sm:!top-full !bg-[repeating-linear-gradient(to_right,rgb(237,34,36),rgb(243,91,34),rgb(249,150,33),rgb(245,193,30),rgb(241,235,27)27%,rgb(241,235,27),rgb(241,235,27)_33%,rgb(99,199,32),rgb(12,155,73),rgb(33,135,141),rgb(57,84,165),rgb(97,55,155),rgb(147,40,142))]"
    />

    <Flex itemsCenter justifyBetween class="w-full sm:mx-auto sm:max-w-[640px]">
      <button
        class="hover:opacity-50 transition-opacity duration-[250ms] disabled:pointer-events-none"
        :class="{ 'text-blue-500': isIndexPage }"
        :disabled="isIndexPage"
      >
        <NuxtLink :to="{ name: 'IndexPage' }">
          <ITablerHome />
        </NuxtLink>
      </button>

      <UIButton
        size="s"
        class="!p-2.5 sm:hidden !rounded-full"
        @click="openEditor"
      >
        <ITablerPencil />
      </UIButton>

      <Flex class="gap-6">
        <UIButton
          size="s"
          class="hidden sm:flex items-center gap-2 !rounded-xl"
          @click="openEditor"
        >
          <ITablerPencil class="!size-5" />
        </UIButton>

        <Flex itemsCenter class="gap-2">
          <Dropdown
            :items="profileDropdownMenu"
            :sideOffset="10"
            :collisionPadding="10"
          >
            <button
              class="hover:opacity-50 transition-opacity duration-[250ms]"
            >
              <ITablerUserCircle />
            </button>
          </Dropdown>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import DoorExit from '~icons/tabler/door-exit'

const route = useRoute()

const isIndexPage = computed(() => route.name === 'IndexPage')

const { isAuthenticated } = useUser()

const { setOpen } = useEditorDialog()

function openEditor() {
  setOpen(true)
}

const { logout } = useUser()

const profileDropdownMenu = [
  {
    label: 'Выйти',
    icon: DoorExit,
    class: 'text-red-500',
    action: () => logout(),
  },
]
</script>
