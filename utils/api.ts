import { type Response, type Profile } from '~/types/index'

export async function signIn(body: { email: string }) {
  return await $fetch('/api/v1/auth/signin', {
    method: 'POST',
    body,
  })
}

export async function signUp(body: {
  email: string
  name: string
  avatar?: string
}) {
  return await $fetch('/api/v1/auth/signup', {
    method: 'POST',
    body,
  })
}

export async function verifyOtp(body: {
  email: string
  token: string
}) {
  return await $fetch('/api/v1/auth/verify_otp', {
    method: 'POST',
    body,
  })
}

export async function me() {
  return await $fetch<Response<Profile>>('/api/v1/me', {
    headers: useRequestHeaders(['cookie']),
  })
}

export async function logout() {
  return await $fetch('/api/v1/me/logout')
}