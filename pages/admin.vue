<template>
  <Flex class="pt-4">
    <UIButton
      class="flex items-center justify-center gap-2"
      @click="state.createProfileDialogIsOpen = true"
    >
      <ITablerUserPlus />
      Создать профиль
    </UIButton>
  </Flex>

  <Dialog v-model:open="state.createProfileDialogIsOpen">
    <Flex col class="gap-4">
      <Flex col class="gap-2">
        <UIInput
          placeholder="Почта"
          v-model.trim="createProfileDialogFormState.email"
        />
        <UIInput
          placeholder="Имя"
          v-model.trim="createProfileDialogFormState.name"
        />
      </Flex>

      <UIButton
        class="flex items-center justify-center gap-2"
        :disabled="createButtonIsDisabled"
        @click="createProfile"
      >
        Создать
      </UIButton>
    </Flex>
  </Dialog>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'is-admin',
})

const state = reactive({
  createProfileDialogIsOpen: false,
})

const createProfileDialogFormState = reactive({
  email: '',
  name: '',
})

const createButtonIsDisabled = computed(
  () =>
    !(
      isValidEmail(createProfileDialogFormState.email) &&
      createProfileDialogFormState.name
    )
)

const { $api } = useNuxtApp()

const { successToastify, errorToastify } = useToasts()

async function createProfile() {
  try {
    await $api.createProfile(createProfileDialogFormState)
    successToastify({ text: 'Профиль создан' })
  } catch (error: any) {
    errorToastify({ text: error.data.message })
  }
}
</script>
