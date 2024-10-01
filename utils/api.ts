import { type AuthResponse } from '@supabase/supabase-js'
import {
  type Response,
  type Profile,
  type VerifyOtpResponse,
  type Article,
  type CDNMedia,
  type SNEmbed,
} from '~/types/index'

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
    ...(import.meta.server && { headers: useRequestHeaders(['cookie']) }),
  })
}

export async function logout() {
  return await $fetch('/api/v1/me/logout')
}

export async function getProfileArticles(profileId: string) {
  return await $fetch<Response<Article[]>>(`/api/v1/profile/${profileId}/articles`)
}

export async function uploadMediaByFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return await $fetch<Response<CDNMedia>>('/api/v1/upload/media/by_file', {
    method: 'POST',
    body: formData,
  })
}

export async function getEmbed(url: string) {
  return await $fetch<Response<SNEmbed>>(`/api/v1/embed?url=${url}`)
}
