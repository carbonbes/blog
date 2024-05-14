<template>
  <Flex center class="h-[calc(100vh_-_60px)]">
    <Flex
      center
      class="relative w-full h-full sm:w-80 sm:h-96 bg-white sm:ring-1 sm:ring-gray-200 sm:rounded-xl sm:shadow-md overflow-hidden"
    >
      <SlideTransition :initialIndex="state.tab">
        <Flex col :class="tabClasses" v-if="state.tab === 1">
          <SlideTransition :initialIndex="state.signInStep">
            <Flex col justifyCenter :class="stepClasses" v-if="state.signInStep === 1">
              <Flex col class="mt-auto gap-4">
                <p class="text-center text-lg font-bold">Вход</p>
                <UIInput
                  type="email"
                  placeholder="Почта"
                  autofocus
                  :disabled="state.signInRequesting"
                  v-model.trim="signInEmail"
                />
                <UIButton
                  :disabled="!isValidEmail(signInEmail) || state.signInRequesting"
                  @click="requestSignIn"
                >
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

            <Flex col center :class="stepClasses" v-else-if="state.signInStep === 2">
              <p class="font-medium text-center">Введите код из письма</p>
              <PinInput @complete="requestVerifySignInOtp" ref="pinInput" />
              <p>Не пришел код?</p>
              <UIButton size="s">Выслать повторно</UIButton>
            </Flex>

            <Flex col center :class="stepClasses" v-else-if="state.signInStep === 3">
              <Flex center class="w-40 h-40 sm:w-20 sm:h-20 bg-green-200 rounded-full">
                <Flex center class="w-20 h-20 sm:w-10 sm:h-10 bg-green-500 rounded-full">
                  <ITablerCheck class="text-white !w-10 !h-10 sm:!w-[unset] sm:!h-[unset]" />
                </Flex>
              </Flex>
              <p>С возвращением!</p>
            </Flex>
          </SlideTransition>
        </Flex>

        <Flex col :class="tabClasses" v-else>
          <SlideTransition :initialIndex="state.signUpStep">
            <Flex col justifyCenter :class="stepClasses" v-if="state.signUpStep === 1">
              <Flex col class="mt-auto gap-4">
                <p class="text-center text-lg font-bold">Регистрация</p>
                <UIInput
                  type="email"
                  placeholder="Почта"
                  autofocus
                  :disabled="state.signUpRequesting"
                  v-model.trim="signUpFormData.email"
                />
                <UIInput
                  placeholder="Имя"
                  :disabled="state.signUpRequesting"
                  v-model.trim="signUpFormData.name"
                />
                <UIButton
                  :disabled="
                    !(isValidEmail(signUpFormData.email) && signUpFormData.name) || state.signUpRequesting
                  "
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

            <Flex col center :class="stepClasses" v-else-if="state.signUpStep === 2">
              <p class="font-medium text-center">Введите код из письма</p>
              <PinInput @complete="requestVerifySignUpOtp" ref="pinInput" />
              <p>Не пришел код?</p>
              <UIButton size="s">Выслать повторно</UIButton>
            </Flex>

            <Flex col center :class="stepClasses" v-else>
              <Flex center class="w-40 h-40 sm:w-20 sm:h-20 bg-green-200 rounded-full">
                <Flex center class="w-20 h-20 sm:w-10 sm:h-10 bg-green-500 rounded-full">
                  <ITablerCheck class="text-white" />
                </Flex>
              </Flex>
              <p>Поздравляем с регистрацией!</p>
            </Flex>
          </SlideTransition>
        </Flex>
      </SlideTransition>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type PinInput from '~/components/global/PinInput.vue'
import { promiseTimeout } from '@vueuse/core'

definePageMeta({
  name: 'LoginPage'
})

const { getMe } = useMe()

const state: {
  tab: 1 | 2
  signInStep: 1 | 2 | 3
  signUpStep: 1 | 2 | 3
  signInRequesting: boolean
  signUpRequesting: boolean
} = reactive({
  tab: 1,
  signInStep: 1,
  signUpStep: 1,
  signInRequesting: false,
  signUpRequesting: false
})

const signInEmail = ref('')

const signUpFormData = reactive({
  email: '',
  name: '',
})

const tabClasses = computed(() => 'relative w-full h-full overflow-hidden')
const stepClasses = computed(() => 'p-8 h-full gap-6')

async function requestSignIn() {
  state.signInRequesting = true

  try {
    await signIn({ email: signInEmail.value })
    state.signInStep = 2
  } catch (error) {

  } finally {
    state.signInRequesting = false
  }
}

async function requestSignUp() {
  state.signUpRequesting = true

  try {
    await signUp(signUpFormData)
    state.signUpStep = 2
  } catch (error) {

  } finally {
    state.signUpRequesting = false
  }
}

const pinInput = ref<typeof PinInput>()

async function requestVerifySignInOtp(code: string) {
  try {
    await verifyOtp({ email: signInEmail.value, token: code })
    await getMe()
    pinInput.value?.showSuccess()
    await promiseTimeout(1000)
    state.signInStep = 3
    await promiseTimeout(3000)
    await navigateTo('/')
  } catch (error: any) {
    pinInput.value?.showError(error.data.message)
  }
}

async function requestVerifySignUpOtp(code: string) {
  try {
    await verifyOtp({ email: signUpFormData.email, token: code })
    await getMe()
    pinInput.value?.showSuccess()
    await promiseTimeout(1000)
    state.signUpStep = 3
    await promiseTimeout(3000)
    await navigateTo('/')
  } catch (error: any) {
    pinInput.value?.showError(error.data.message)
  }
}
</script>
