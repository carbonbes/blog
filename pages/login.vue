<template>
  <Flex center class="h-[calc(100vh_-_60px)]">
    <Flex center :class="loginFormClasses">
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
                  class="font-medium"
                  :disabled="!isValidEmail(signInEmail) || state.signInRequesting"
                  @click="requestSignIn"
                >
                  Войти
                </UIButton>
              </Flex>

              <UIButton
                variant="secondary"
                class="mt-auto !text-gray-500 hover:!text-gray-900"
                :disabled="state.signInRequesting"
                @click="state.tab = 2"
              >
                У меня нет аккаунта
              </UIButton>
            </Flex>

            <Flex col center :class="stepClasses" v-else>
              <Flex col class="mt-auto gap-4">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying || state.signInRequesting"
                  @complete="requestVerifySignInOtp"
                  ref="pinInputRef"
                />
              </Flex>

              <Flex col class="mt-auto w-full gap-2">
                <p class="text-center text-gray-500">Не пришел код?</p>
                <UIButton
                  class="font-medium"
                  :disabled="state.otpVerifying || state.signInRequesting || !state.canResendOtp"
                  @click="requestSignIn"
                >
                  Выслать повторно
                </UIButton>
                <Countdown
                  :initial="Date.now() + 60000"
                  @complete="state.canResendOtp = true"
                  class="text-center"
                  ref="countdownRef"
                  v-if="!state.canResendOtp"
                />
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
                  class="font-medium"
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
                :disabled="state.signUpRequesting"
                @click="state.tab = 1"
              >
                У меня есть аккаунт
              </UIButton>
            </Flex>

            <Flex col center :class="stepClasses" v-else>
              <Flex col class="mt-auto gap-4">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying || state.signUpRequesting"
                  @complete="requestVerifySignUpOtp"
                  ref="pinInputRef"
                />
              </Flex>
              
              <Flex col class="mt-auto w-full gap-2">
                <p class="text-center text-gray-500">Не пришел код?</p>
                <UIButton
                  class="font-medium"
                  :disabled="state.otpVerifying || state.signUpRequesting || !state.canResendOtp"
                  @click="requestSignUp"
                >
                  Выслать повторно
                </UIButton>
                <Countdown
                  :initial="Date.now() + 60000"
                  @complete="state.canResendOtp = true"
                  class="text-center"
                  ref="countdownRef"
                  v-if="!state.canResendOtp"
                />
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
import type Countdown from '~/components/global/Countdown.vue'

definePageMeta({
  name: 'LoginPage'
})

const { getMe } = useMe()
const { successNotify, errorNotify } = useNotifications()

const state: {
  tab: 1 | 2
  signInStep: 1 | 2
  signUpStep: 1 | 2
  signInRequesting: boolean
  signUpRequesting: boolean
  otpVerifying: boolean
  canResendOtp: boolean
} = reactive({
  tab: 1,
  signInStep: 1,
  signUpStep: 1,
  signInRequesting: false,
  signUpRequesting: false,
  otpVerifying: false,
  canResendOtp: false
})

const signInEmail = ref('')

const signUpFormData = reactive({
  email: '',
  name: '',
})

const loginFormClasses = computed(() => 'relative w-full h-full sm:w-80 sm:h-96 bg-white sm:ring-1 sm:ring-gray-200 sm:rounded-xl sm:shadow-md overflow-hidden')
const tabClasses = computed(() => 'relative w-full h-full overflow-hidden')
const stepClasses = computed(() => 'p-8 h-full')

const countdownRef = ref<typeof Countdown>()

async function requestSignIn(resend?: boolean) {
  state.signInRequesting = true

  try {
    await signIn({ email: signInEmail.value })
    state.signInStep = 2
    if (resend) {
      state.canResendOtp = false
      countdownRef.value?.startCounting()
    }
    successNotify({ text: 'Письмо с кодом было выслано на указанную почту' })
  } catch (error: any) {
    errorNotify({ text: error.data.message })
  } finally {
    state.signInRequesting = false
  }
}

async function requestSignUp(resend?: boolean) {
  state.signUpRequesting = true

  try {
    await signUp(signUpFormData)
    state.signUpStep = 2
    if (resend) {
      state.canResendOtp = false
      countdownRef.value?.startCounting()
    }
    successNotify({ text: 'Письмо с кодом было выслано на указанную почту' })
  } catch (error: any) {
    errorNotify({ text: error.data.message })
  } finally {
    state.signUpRequesting = false
  }
}

const pinInputRef = ref<typeof PinInput>()

async function requestVerifySignInOtp(code: string) {
  state.otpVerifying = true

  try {
    await verifyOtp({ email: signInEmail.value, token: code })
    await getMe()
    await navigateTo('/')
  } catch (error: any) {
    pinInputRef.value?.showError(error.data.message)
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
    pinInputRef.value?.showError(error.data.message)
    errorNotify({ text: error.data.message })
  } finally {
    state.otpVerifying = false
  }
}
</script>
