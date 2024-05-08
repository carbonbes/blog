<template>
  <DevOnly>
    <UIButton @click="step -= 1">Предыдущая</UIButton>
    <UIButton @click="step += 1">Следующая</UIButton>
  </DevOnly>

  <div class="h-screen flex items-center justify-center">
    <div class="relative p-4 w-80 h-60 flex items-center justify-center border border-gray-200/75 rounded-2xl shadow-lg overflow-hidden">
      <ViewWithTransition :initialIndex="step">
        <div class="flex flex-col gap-4" v-if="step === 1">
          <UIInput
            type="email"
            placeholder="Почта"
            autofocus
            v-model.trim="formState.email"
          />
          <UIInput
            placeholder="Имя"
            v-model.trim="formState.name"
          />
          <UIButton
            :disabled="!(formState.email && formState.name)"
            @click="_signIn"
          >
            Войти
          </UIButton>
        </div>

        <div class="flex flex-col gap-4" v-else-if="step === 2">
          <p class="font-medium text-center">Введите код из письма</p>
          <PinInput @complete="(code) => console.log(code)"/>
        </div>
      </ViewWithTransition>
    </div>
  </div>
</template>

<script lang="ts" setup>
const step = ref(1)

const formState = reactive({
  email: '',
  name: '',
  avatar_url: ''
})

async function _signIn() {
  try {
    await signIn(formState)
    step.value += 1
  } catch (error) {

  }
}
</script>
