<template>
  <Flex itemsCenter justifyCenter class="h-[calc(100vh_-_60px)]">
    <Flex
      itemsCenter
      justifyCenter
      class="relative w-full h-full sm:w-80 sm:h-80 bg-white sm:ring-1 sm:ring-gray-200 sm:rounded-xl sm:shadow-md overflow-hidden"
    >
      <WithTransition :initialIndex="state.tab">
        <Flex col class="relative w-full h-full overflow-hidden" v-if="state.tab === 1">
          <WithTransition :initialIndex="state.signInStep">
            <Flex col justifyCenter class="p-8 h-full" v-if="state.signInStep === 1">
              <Flex col class="mt-auto gap-4">
                <p class="text-center text-lg font-bold">Вход</p>
                <UIInput type="email" placeholder="Почта" autofocus v-model.trim="signInEmail" />
                <UIButton :disabled="!isValidEmail(signInEmail)" @click="requestSignIn">
                  Войти
                </UIButton>
              </Flex>
              <UIButton
                variant="secondary"
                class="mt-auto !text-gray-500 hover:!text-gray-900"
                @click="state.tab = 2"
              >
                У меня нет аккаунта
              </UIButton>
            </Flex>

            <Flex col justifyCenter class="p-8 h-full gap-4" v-else-if="state.signInStep === 2">
              <p class="font-medium text-center">Введите код из письма</p>
              <PinInput @complete="requestVerifySignInOtp" ref="pinInput" />
            </Flex>

            <Flex col itemsCenter justifyCenter class="p-8 h-full gap-4" v-else-if="state.signInStep === 3">
              <Flex itemsCenter justifyCenter class="mt-auto w-20 h-20 bg-green-200 rounded-full">
                <Flex itemsCenter justifyCenter class="w-10 h-10 bg-green-500 rounded-full">
                  <ITablerCheck class="text-white" />
                </Flex>
              </Flex>
              <p>С возвращением!</p>
              <UIButton secondary class="mt-auto">Перейти в профиль</UIButton>
            </Flex>
          </WithTransition>
        </Flex>

        <Flex col class="relative w-full h-full overflow-hidden" v-else>
          <WithTransition :initialIndex="state.signUpStep">
            <Flex col justifyCenter class="p-8 h-full gap-4" v-if="state.signUpStep === 1">
              <Flex col class="mt-auto gap-4">
                <p class="text-center text-lg font-bold">Регистрация</p>
                <UIInput type="email" placeholder="Почта" autofocus v-model.trim="signUpFormData.email" />
                <UIInput placeholder="Имя" v-model.trim="signUpFormData.name" />
                <UIButton
                  :disabled="!(isValidEmail(signUpFormData.email) && signUpFormData.name)"
                  @click="requestSignUp"
                >
                  Зарегистрироваться
                </UIButton>
              </Flex>
              <UIButton
                variant="secondary"
                class="mt-auto !text-gray-500 hover:!text-gray-900"
                @click="state.tab = 1"
              >
                У меня есть аккаунт
              </UIButton>
            </Flex>

            <Flex col itemsCenter justifyCenter class="p-8 h-full gap-4" v-else-if="state.signUpStep === 2">
              <p class="font-medium text-center">Введите код из письма</p>
              <PinInput @complete="requestVerifySignUpOtp" ref="pinInput" />
            </Flex>

            <Flex col itemsCenter justifyCenter class="p-8 h-full gap-4" v-else>
              <Flex itemsCenter justifyCenter class="mt-auto w-20 h-20 bg-green-200 rounded-full">
                <Flex itemsCenter justifyCenter class="w-10 h-10 bg-green-500 rounded-full">
                  <ITablerCheck class="text-white" />
                </Flex>
              </Flex>
              <p>Поздравляем с регистрацией!</p>
              <UIButton secondary class="mt-auto">Перейти в профиль</UIButton>
            </Flex>
          </WithTransition>
        </Flex>
      </WithTransition>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type PinInput from '~/components/global/PinInput.vue'

definePageMeta({
  name: 'LoginPage'
})

const state: {
  tab: 1 | 2
  signInStep: 1 | 2 | 3
  signUpStep: 1 | 2 | 3
} = reactive({
  tab: 1,
  signInStep: 1,
  signUpStep: 1
})

const signInEmail = ref('')

const signUpFormData = reactive({
  email: '',
  name: '',
})

async function requestSignIn() {
  try {
    await signIn({ email: signInEmail.value })
    state.signInStep += 1
  } catch (error) {

  }
}

async function requestSignUp() {
  try {
    await signIn(signUpFormData)
    state.signUpStep += 1
  } catch (error) {

  }
}

const pinInput = ref<typeof PinInput>()

async function requestVerifySignInOtp(code: string) {
  try {
    await verifyOtp({ email: signInEmail.value, token: code })
    pinInput.value?.showSuccess()
    state.signInStep += 1
  } catch (error: any) {
    pinInput.value?.showError(error.data.message)
  }
}

async function requestVerifySignUpOtp(code: string) {
  try {
    await verifyOtp({ email: signUpFormData.email, token: code })
    pinInput.value?.showSuccess()
  } catch (error: any) {
    pinInput.value?.showError(error.data.message)
  }
}
</script>
