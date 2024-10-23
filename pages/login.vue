<template>
  <Flex center class="h-full">
    <Flex
      center
      class="w-full h-full sm:w-96 sm:h-96 bg-white sm:ring-1 sm:ring-gray-200 sm:rounded-xl sm:shadow-md overflow-hidden"
    >
      <Swiper
        :speed="250"
        :allowTouchMove="false"
        class="w-full h-full"
        ref="swiperTabRef"
      >
        <SwiperSlide :class="tabClasses">
          <Swiper
            :speed="250"
            :allowTouchMove="false"
            class="w-full h-full"
            ref="swiperSignInViewRef"
          >
            <SwiperSlide :class="stepClasses">
              <Flex col class="mt-auto gap-4">
                <p class="text-center text-lg font-bold">Вход</p>
                <UIInput
                  type="email"
                  placeholder="Почта"
                  :disabled="state.signInRequesting"
                  class="rounded-xl"
                  v-model.trim="signInEmail"
                  ref="emailInputRef"
                />
                <UIButton
                  class="font-medium rounded-xl"
                  :disabled="!isValidEmail(signInEmail) || state.signInRequesting"
                  @click="requestSignIn"
                >
                  Войти
                </UIButton>
              </Flex>

              <UIButton
                variant="secondary"
                class="mt-auto !text-gray-500 hover:!text-gray-900 border rounded-xl"
                :disabled="state.signInRequesting"
                @click="nextTab"
              >
                У меня нет аккаунта
              </UIButton>
            </SwiperSlide>

            <SwiperSlide :class="stepClasses">
              <Flex col class="mt-auto gap-4">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying || state.signInRequesting"
                  @complete="requestVerifySignInOtp"
                  class="justify-center"
                  ref="pinInputRef"
                />
              </Flex>

              <Flex col class="mt-auto w-full gap-2">
                <p class="text-center text-gray-500">Не пришел код?</p>
                <UIButton
                  class="font-medium rounded-xl"
                  :disabled="state.otpVerifying || state.signInRequesting || !state.canResendOtp"
                  @click="requestSignIn"
                >
                  Выслать повторно
                </UIButton>
                <Countdown
                  v-if="!state.canResendOtp"
                  :initial="Date.now() + 60000"
                  @complete="state.canResendOtp = true"
                  class="text-center"
                  ref="countdownRef"
                />
              </Flex>
            </SwiperSlide>
          </Swiper>
        </SwiperSlide>

        <SwiperSlide :class="tabClasses">
          <Swiper
            :speed="250"
            :allowTouchMove="false"
            class="w-full h-full"
            ref="swiperSignUpViewRef"
          >
            <SwiperSlide :class="stepClasses">
              <Flex col class="mt-auto gap-4">
                <p class="text-center text-lg font-bold">Регистрация</p>
                <UIInput
                  type="email"
                  placeholder="Почта"
                  :disabled="state.signUpRequesting"
                  class="rounded-xl"
                  v-model.trim="signUpFormData.email"
                  ref="emailInputRef"
                />
                <UIInput
                  placeholder="Имя"
                  :disabled="state.signUpRequesting"
                  class="rounded-xl"
                  v-model.trim="signUpFormData.name"
                />
                <UIButton
                  class="font-medium rounded-xl"
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
                class="mt-auto !text-gray-500 hover:!text-gray-900 rounded-xl"
                :disabled="state.signUpRequesting"
                @click="prevTab"
              >
                У меня есть аккаунт
              </UIButton>
            </SwiperSlide>

            <SwiperSlide :class="stepClasses">
              <Flex col class="mt-auto gap-4">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying || state.signUpRequesting"
                  @complete="requestVerifySignUpOtp"
                  class="justify-center"
                  ref="pinInputRef"
                />
              </Flex>
              
              <Flex col class="mt-auto w-full gap-2">
                <p class="text-center text-gray-500">Не пришел код?</p>
                <UIButton
                  class="font-medium rounded-xl"
                  :disabled="state.otpVerifying || state.signUpRequesting || !state.canResendOtp"
                  @click="requestSignUp"
                >
                  Выслать повторно
                </UIButton>
                <Countdown
                  v-if="!state.canResendOtp"
                  :initial="Date.now() + 60000"
                  @complete="state.canResendOtp = true"
                  class="text-center"
                  ref="countdownRef"
                />
              </Flex>
            </SwiperSlide>
          </Swiper>
        </SwiperSlide>
      </Swiper>
    </Flex>
  </Flex>
</template>

<script lang="ts" setup>
import type PinInput from '~/components/global/PinInput.vue'
import type Countdown from '~/components/global/Countdown.vue'
import type Swiper from '~/components/global/swiper/Swiper.vue'

definePageMeta({
  name: 'LoginPage'
})

const { getMe } = useUser()
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

const swiperTabRef = ref<InstanceType<typeof Swiper>>()
const swiperSignInViewRef = ref<InstanceType<typeof Swiper>>()
const swiperSignUpViewRef = ref<InstanceType<typeof Swiper>>()

const emailInputRef = ref<HTMLInputElement>()

function prevTab() {
  state.tab--
  swiperTabRef.value.swiper?.slidePrev()
}

function nextTab() {
  state.tab++
  swiperTabRef.value.swiper?.slideNext()
}

function nextSignInView() {
  state.signInStep++
  swiperSignInViewRef.value.swiper?.slideNext()
}

function nextSignUpView() {
  state.signUpStep++
  swiperSignUpViewRef.value.swiper?.slideNext()
}

function emailInputFocus() {
  if (state.tab === 1 && state.signInStep === 1 && emailInputRef.value) {
    emailInputRef.value.focus()
  } else if (state.tab === 2 && state.signUpStep === 1 && emailInputRef.value) {
    emailInputRef.value.focus()
  }
}

onMounted(emailInputFocus)

function pinInputFocus() {
  if (state.tab === 1 && state.signInStep === 2 && pinInputRef.value) {
    pinInputRef.value.focus()
  } else if (state.tab === 2 && state.signUpStep === 2 && pinInputRef.value) {
    pinInputRef.value.focus()
  }
}

const signInEmail = ref('')

const signUpFormData = reactive({
  email: '',
  name: '',
})

const tabClasses = 'h-full flex flex-col overflow-hidden'
const stepClasses = 'p-8 w-full h-full flex flex-col justify-center'

const countdownRef = ref<InstanceType<typeof Countdown>>()

async function requestSignIn(resend?: boolean) {
  state.signInRequesting = true

  try {
    await signIn({ email: signInEmail.value })
    nextSignInView()
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
    nextSignUpView()
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

const pinInputRef = ref<InstanceType<typeof PinInput>>()

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
