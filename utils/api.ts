import { type AuthResponse } from '@supabase/supabase-js'
import {
  type Response,
  type Profile,
  type VerifyOtpResponse,
  type Article,
  type StorageMedia,
  type SNEmbed,
} from '~/types/index'
import type { ArticleBody } from '~/types'

export async function signIn(body: { email: string }) {
  return await $fetch<Response<AuthResponse>>('/api/v1/auth/signin', {
    method: 'POST',
    body,
  })
}

export async function signUp(body: { email: string; name: string }) {
  return await $fetch<Response<AuthResponse>>('/api/v1/auth/signup', {
    method: 'POST',
    body,
  })
}

export async function verifyOtp(body: { email: string; token: string }) {
  return await $fetch<Response<VerifyOtpResponse>>('/api/v1/auth/verify_otp', {
    method: 'POST',
    body,
  })
}

export async function me() {
  return (
    await $fetch<Response<Profile>>('/api/v1/me', {
      headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
    })
  ).data
}

export async function logout() {
  return await $fetch('/api/v1/me/logout')
}

export async function getProfileArticles(profileId: number, page = 1) {
  return (
    await $fetch<Response<Article[]>>(`/api/v1/profile/${profileId}/articles`, {
      query: { page },
    })
  ).data
}

export async function getProfileDrafts(profileId: number, page = 1) {
  return (
    await $fetch<Response<Article[]>>(`/api/v1/profile/${profileId}/drafts`, {
      headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
      query: { page },
    })
  ).data
}

export async function uploadMediaByFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return (
    await $fetch<Response<StorageMedia>>('/api/v1/upload/media/by_file', {
      method: 'POST',
      body: formData,
    })
  ).data
}

export async function uploadMediaByUrl(url: string) {
  return await $fetch<Response<StorageMedia>>('/api/v1/upload/media/by_url', {
    method: 'POST',
    body: { url },
  })
}

export async function getXEmbed(url: string) {
  return (
    await $fetch<Response<SNEmbed>>('/api/v1/embeds/x', {
      query: { url },
    })
  ).data
}

export async function getTelegramEmbed(url: string) {
  return (
    await $fetch<Response<SNEmbed>>('/api/v1/embeds/telegram', {
      query: { url },
    })
  ).data
}

export async function createArticle(body: ArticleBody) {
  return (
    await $fetch<Response<Article>>('/api/v1/article/create', {
      method: 'POST',
      body,
    })
  ).data
}

export async function updateArticle(id: number, body: ArticleBody) {
  return (
    await $fetch<Response<Article>>(`/api/v1/article/${id}`, {
      method: 'PATCH',
      body: { body },
    })
  ).data
}

export async function removeArticle(id: number) {
  return await $fetch<Response>(`/api/v1/article/${id}`, {
    method: 'DELETE',
  })
}

export async function getArticle(id: number) {
  return (await $fetch<Response<Article>>(`/api/v1/article/${id}`)).data
}
