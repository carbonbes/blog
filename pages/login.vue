<template>
  <Flex center class="h-[calc(100vh_-_60px)]">
    <Flex center :class="loginClasses">
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

            <Flex col center :class="stepClasses" v-else>
              <Flex col class="mt-auto gap-4">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying"
                  @complete="requestVerifySignInOtp"
                  ref="pinInput"
                />
              </Flex>

              <Flex col class="mt-auto gap-2">
                <p class="text-center">Не пришел код?</p>
                <UIButton :disabled="state.otpVerifying">Выслать повторно</UIButton>
              </Flex>
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

            <Flex col center :class="stepClasses" v-else>
              <Flex col class="mt-auto gap-4">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying"
                  @complete="requestVerifySignUpOtp"
                  ref="pinInput"
                />
              </Flex>
              
              <Flex col class="mt-auto gap-2">
                <p class="text-center">Не пришел код?</p>
                <UIButton :disabled="state.otpVerifying">Выслать повторно</UIButton>
              </Flex>
            </Flex>
          </SlideTransition>
        </Flex>
      </SlideTransition>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type PinInput from '~/components/global/PinInput.vue'

definePageMeta({
  name: 'LoginPage'
})

const { getMe } = useMe()
const { errorNotify } = useNotifications()

const state: {
  tab: 1 | 2
  signInStep: 1 | 2
  signUpStep: 1 | 2
  signInRequesting: boolean
  signUpRequesting: boolean
  otpVerifying: boolean
} = reactive({
  tab: 1,
  signInStep: 1,
  signUpStep: 1,
  signInRequesting: false,
  signUpRequesting: false,
  otpVerifying: false
})

const signInEmail = ref('')

const signUpFormData = reactive({
  email: '',
  name: '',
})

const loginClasses = computed(() => 'relative w-full h-full sm:w-80 sm:h-96 bg-white sm:ring-1 sm:ring-gray-200 sm:rounded-xl sm:shadow-md overflow-hidden')
const tabClasses = computed(() => 'relative w-full h-full overflow-hidden')
const stepClasses = computed(() => 'p-8 h-full gap-6')

async function requestSignIn() {
  state.signInRequesting = true

  try {
    await signIn({ email: signInEmail.value })
    state.signInStep = 2
  } catch (error: any) {
    errorNotify({ text: error.data.message })
  } finally {
    state.signInRequesting = false
  }
}

async function requestSignUp() {
  state.signUpRequesting = true

  try {
    await signUp(signUpFormData)
    state.signUpStep = 2
  } catch (error: any) {
    errorNotify({ text: error.data.message })
  } finally {
    state.signUpRequesting = false
  }
}

const pinInput = ref<typeof PinInput>()

async function requestVerifySignInOtp(code: string) {
  state.otpVerifying = true

  try {
    await verifyOtp({ email: signInEmail.value, token: code })
    await getMe()
    await navigateTo('/')
  } catch (error: any) {
    pinInput.value?.showError(error.data.message)
    errorNotify({ text: error.data.message })
  } finally {
    state.otpVerifying = false
  }
}

async function requestVerifySignUpOtp(code: string) {
  state.otpVerifying = true
  
  try {
    await verifyOtp({ email: signUpFormData.email, token: code })
    await getMe()
    await navigateTo('/')
  } catch (error: any) {
    pinInput.value?.showError(error.data.message)
    errorNotify({ text: error.data.message })
  } finally {
    state.otpVerifying = false
  }
}
</script>
