import { type Response, type Profile, type VerifyOtpResponse } from '~/types/index'
import { type AuthResponse } from '@supabase/supabase-js'

export async function signIn(body: { email: string }) {
  return await $fetch<Response<AuthResponse>>('/api/v1/auth/signin', {
    method: 'POST',
    body,
  })
}

export async function signUp(body: {
  email: string
  name: string
}) {
  return await $fetch<Response<AuthResponse>>('/api/v1/auth/signup', {
    method: 'POST',
    body,
  })
}

export async function verifyOtp(body: {
  email: string
  token: string
}) {
  return await $fetch<Response<VerifyOtpResponse>>('/api/v1/auth/verify_otp', {
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