<template>
  <Flex center class="h-[calc(100vh_-_60px)]">
    <Flex center class="sm:w-96 h-full sm:h-96 bg-white sm:ring-1 sm:ring-gray-200 sm:rounded-xl sm:shadow-md overflow-hidden">
      <SlideTransition class="w-full h-full" ref="tabViewRef">
        <div class="h-full">
          <SlideTransition class="w-full h-full" ref="signInViewRef">
            <div :class="stepClasses">
              <Flex col justifyBetween class="w-full h-96 sm:h-full">
                <p class="text-center text-lg font-bold">Вход</p>

                <Flex col class="gap-4">
                  <UIInput
                    type="email"
                    placeholder="Почта"
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
                  class="!text-gray-500 hover:!text-gray-900"
                  :disabled="state.signInRequesting"
                  @click="state.tab = 2; tabViewRef?.next()"
                >
                  У меня нет аккаунта
                </UIButton>
              </Flex>
            </div>

            <div :class="stepClasses">
              <Flex col justifyCenter class="w-full h-96 sm:h-full">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying || state.signInRequesting"
                  @complete="requestVerifySignInOtp"
                  ref="pinInputRef"
                />
              </Flex>

              <Flex col class="w-full gap-2">
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
            </div>
          </SlideTransition>
        </div>

        <div class="h-full">
          <SlideTransition
            class="w-full h-full"
            ref="signUpViewRef"
            v-slot="activeIndex"
          >
            <div :class="stepClasses">
              <Flex col justifyBetween class="w-full h-96 sm:h-full">
                <p class="text-center text-lg font-bold">Регистрация</p>

                <Flex col class="gap-4">
                  <UIInput
                    type="email"
                    placeholder="Почта"
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
                  class="!text-gray-500 hover:!text-gray-900"
                  :disabled="state.signUpRequesting"
                  @click="state.tab = 1; tabViewRef?.previous()"
                >
                  У меня есть аккаунт
                </UIButton>
              </Flex>
            </div>

            <div :class="stepClasses">
              <Flex justifyBetween class="w-full h-96 sm:h-full">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying || state.signUpRequesting"
                  @complete="requestVerifySignUpOtp"
                  ref="pinInputRef"
                />
              </Flex>
              
              <Flex col class="w-full gap-2">
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
            </div>
          </SlideTransition>
        </div>
      </SlideTransition>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type PinInput from '~/components/global/PinInput.vue'
import type Countdown from '~/components/global/Countdown.vue'
import type SlideTransition from '~/components/global/SlideTransition.vue'

definePageMeta({
  name: 'LoginPage'
})

const { getMe } = useMe()
const { successNotify, errorNotify } = useNotifications()

const state = reactive({
  tab: 1,
  signInStep: 1,
  signUpStep: 1,
  signInRequesting: false,
  signUpRequesting: false,
  otpVerifying: false,
  canResendOtp: false
})

const tabViewRef = ref<InstanceType<typeof SlideTransition>>()
const signInViewRef = ref<InstanceType<typeof SlideTransition>>()
const signUpViewRef = ref<InstanceType<typeof SlideTransition>>()

const signInEmail = ref('')

const signUpFormData = reactive({
  email: '',
  name: '',
})

const stepClasses = 'flex items-center sm:block p-8 h-full'

const countdownRef = ref<typeof Countdown>()

async function requestSignIn(resend?: boolean) {
  state.signInRequesting = true

  try {
    await signIn({ email: signInEmail.value })
    state.signInStep = 2
    signInViewRef.value?.next()
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
    signUpViewRef.value?.next()
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
