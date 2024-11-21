<template>
  <Flex center class="h-full">
    <Flex
      center
      class="w-full h-full sm:w-[400px] sm:h-[450px] bg-white sm:rounded-xl sm:shadow-sm overflow-hidden"
    >
      <Swiper
        :speed="250"
        :allowTouchMove="false"
        @swipertransitionend="onTransitionEnd"
        class="w-full h-full"
        ref="swiperTabRef"
      >
        <SwiperSlide :class="tabClasses">
          <Swiper
            :speed="250"
            :allowTouchMove="false"
            @swipertransitionend="onTransitionEnd"
            class="w-full h-full"
            ref="swiperSignInViewRef"
          >
            <SwiperSlide :class="stepClasses">
              <Flex col class="mt-auto gap-8">
                <Flex col class="gap-2">
                  <ITablerLogin2 class="mx-auto !size-8 text-gray-500" />
                  <p class="text-center text-lg font-bold">Вход</p>
                </Flex>

                <Flex col class="gap-4">
                  <UIInput
                    type="email"
                    placeholder="Почта"
                    :disabled="state.signInRequesting"
                    class="rounded-xl"
                    v-model.trim="signInEmail"
                    @keydown.enter="onInputEnterDown"
                    ref="signinEmailInputRef"
                  />
                  <UIButton
                    class="font-medium rounded-xl"
                    :disabled="!canSignin"
                    @click="requestSignIn"
                  >
                    Войти
                  </UIButton>
                </Flex>
              </Flex>

              <button
                variant="secondary"
                class="mt-auto text-gray-400 hover:text-gray-900 transition-colors"
                :disabled="state.signInRequesting"
                @click="nextTab"
              >
                У меня нет аккаунта
              </button>
            </SwiperSlide>

            <SwiperSlide :class="stepClasses">
              <Flex col class="mt-auto gap-4">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying || state.signInRequesting"
                  @complete="requestVerifySignInOtp"
                  size="size-12 sm:size-10"
                  rounded="rounded-xl"
                  class="justify-center"
                  ref="pinInputRef"
                />
              </Flex>

              <Flex col class="mt-auto w-full gap-2">
                <p class="text-center text-gray-500">Не пришел код?</p>
                <UIButton
                  class="font-medium rounded-xl"
                  :disabled="!canSendSigninOtp"
                  @click="requestSignIn({ resend: true })"
                >
                  Выслать повторно
                </UIButton>
                <Countdown
                  v-if="state.signInStep === 2 && !state.canResendOtp"
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
            @swipertransitionend="onTransitionEnd"
            class="w-full h-full"
            ref="swiperSignUpViewRef"
          >
            <SwiperSlide :class="stepClasses">
              <Flex col class="mt-auto gap-8">
                <Flex col class="gap-2">
                  <ITablerUserPlus class="mx-auto !size-8 text-gray-500" />
                  <p class="text-center text-lg font-bold">Регистрация</p>
                </Flex>

                <Flex col class="gap-4">
                  <UIInput
                    type="email"
                    placeholder="Почта"
                    :disabled="state.signUpRequesting"
                    class="rounded-xl"
                    v-model.trim="signUpFormData.email"
                    @keydown.enter="onInputEnterDown"
                    ref="signupEmailInputRef"
                  />
                  <UIInput
                    placeholder="Имя"
                    :disabled="state.signUpRequesting"
                    class="rounded-xl"
                    v-model.trim="signUpFormData.name"
                    @keydown.enter="onInputEnterDown"
                    ref="signupNameInputRef"
                  />
                  <UIButton
                    class="font-medium rounded-xl"
                    :disabled="!canSignup"
                    @click="requestSignUp"
                  >
                    Зарегистрироваться
                  </UIButton>
                </Flex>
              </Flex>

              <button
                variant="secondary"
                class="mt-auto text-gray-400 hover:text-gray-900 transition-colors"
                :disabled="state.signUpRequesting"
                @click="prevTab"
              >
                У меня есть аккаунт
              </button>
            </SwiperSlide>

            <SwiperSlide :class="stepClasses">
              <Flex col class="mt-auto gap-4">
                <p class="font-medium text-center">Введите код из письма</p>
                <PinInput
                  :disabled="state.otpVerifying || state.signUpRequesting"
                  @complete="requestVerifySignUpOtp"
                  rounded="rounded-xl"
                  class="justify-center"
                  ref="pinInputRef"
                />
              </Flex>

              <Flex col class="mt-auto w-full gap-2">
                <p class="text-center text-gray-500">Не пришел код?</p>
                <UIButton
                  class="font-medium rounded-xl"
                  :disabled="!canSendSignupOtp"
                  @click="requestSignUp({ resend: true })"
                >
                  Выслать повторно
                </UIButton>
                <Countdown
                  v-if="state.signUpStep === 2 && !state.canResendOtp"
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
  name: 'LoginPage',
})

useSeoMeta({
  title: 'Авторизация',
})

const { $api } = useNuxtApp()

const { getMe } = useUser()
const { successToastify, errorToastify } = useToasts()

const state = reactive({
  tab: 1,
  signInStep: 1,
  signUpStep: 1,
  signInRequesting: false,
  signUpRequesting: false,
  otpVerifying: false,
  canResendOtp: false,
})

const swiperTabRef = ref<InstanceType<typeof Swiper>>()
const swiperSignInViewRef = ref<InstanceType<typeof Swiper>>()
const swiperSignUpViewRef = ref<InstanceType<typeof Swiper>>()

const signinEmailInputRef = ref<HTMLInputElement>()
const signupEmailInputRef = ref<HTMLInputElement>()
const signupNameInputRef = ref<HTMLInputElement>()

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
  if (state.tab === 1 && state.signInStep === 1) {
    signinEmailInputRef.value?.focus()
  } else if (state.tab === 2 && state.signUpStep === 1) {
    signupEmailInputRef.value?.focus()
  }
}

function pinInputFocus() {
  if (state.tab === 1 && state.signInStep === 2) {
    pinInputRef.value?.focus()
  } else if (state.tab === 2 && state.signUpStep === 2) {
    pinInputRef.value?.focus()
  }
}

onMounted(async () => {
  await nextTick()

  emailInputFocus()
  pinInputFocus()
})

function onTransitionEnd() {
  emailInputFocus()
  pinInputFocus()
}

function onInputEnterDown() {
  if (state.tab === 1) {
    if (!signInEmail.value) return

    requestSignIn()
  }

  if (state.tab === 2) {
    if (isValidEmail(signUpFormData.email) && !signUpFormData.name) {
      signupNameInputRef.value?.focus()
    }

    if (isValidEmail(signUpFormData.email) && signUpFormData.name) {
      requestSignUp()
    }
  }
}

const signInEmail = ref('')

const signUpFormData = reactive({
  email: '',
  name: '',
})

const canSignin = computed(
  () => isValidEmail(signInEmail.value) && !state.signInRequesting
)

const canSignup = computed(
  () =>
    isValidEmail(signUpFormData.email) &&
    !!signUpFormData.name &&
    !state.signUpRequesting
)

const canSendSigninOtp = computed(
  () => state.canResendOtp && !(state.otpVerifying || state.signInRequesting)
)

const canSendSignupOtp = computed(
  () => state.canResendOtp && !(state.otpVerifying || state.signUpRequesting)
)

const tabClasses = 'h-full flex flex-col overflow-hidden'
const stepClasses = 'p-8 w-full h-full flex flex-col justify-center'

const countdownRef = ref<InstanceType<typeof Countdown>>()

async function requestSignIn({ resend }: { resend?: boolean } = {}) {
  if (!canSignin) return

  try {
    state.signInRequesting = true

    await $api.signIn({ email: signInEmail.value })

    if (!resend) {
      nextSignInView()
    }

    if (resend) {
      state.canResendOtp = false
      countdownRef.value?.startCounting()
    }

    successToastify({ text: 'Письмо с кодом было выслано на указанную почту' })
  } catch (error: any) {
    errorToastify({ text: error.data.message })
  } finally {
    state.signInRequesting = false
  }
}

async function requestSignUp({ resend }: { resend?: boolean } = {}) {
  if (!canSignup) return

  try {
    state.signUpRequesting = true

    await $api.signUp(signUpFormData)

    if (!resend) {
      nextSignUpView()
    }

    if (resend) {
      state.canResendOtp = false
      countdownRef.value?.startCounting()
    }

    successToastify({ text: 'Письмо с кодом было выслано на указанную почту' })
  } catch (error: any) {
    errorToastify({ text: error.data.message })
  } finally {
    state.signUpRequesting = false
  }
}

const pinInputRef = ref<InstanceType<typeof PinInput>>()

async function requestVerifySignInOtp(code: string) {
  try {
    state.otpVerifying = true

    await $api.verifyOtp({ email: signInEmail.value, token: code })
    await getMe()
    await navigateTo('/')
  } catch (error: any) {
    pinInputRef.value?.showError(error.data.message)
    errorToastify({ text: error.data.message })
  } finally {
    state.otpVerifying = false
  }
}

async function requestVerifySignUpOtp(code: string) {
  try {
    state.otpVerifying = true

    await $api.verifyOtp({ email: signUpFormData.email, token: code })
    await getMe()
    await navigateTo('/')
  } catch (error: any) {
    pinInputRef.value?.showError(error.data.message)
    errorToastify({ text: error.data.message })
  } finally {
    state.otpVerifying = false
  }
}
</script>
