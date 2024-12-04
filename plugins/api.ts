import type {
  Article,
  ArticleBody,
  Profile,
  Response,
  SNEmbed,
  StorageMedia,
  VerifyOtpResponse,
} from '~/types'
import { type AuthResponse } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const fetchInstance = $fetch.create({
    baseURL: '/api',
    headers: useRequestHeaders(['cookie']),
  })

  const api = {
    async signIn(body: { email: string }) {
      return (
        await fetchInstance<Response<AuthResponse>>('/v1/auth/signin', {
          method: 'POST',
          body,
        })
      ).data
    },

    async signUp(body: { email: string; name: string }) {
      return (
        await fetchInstance<Response<AuthResponse>>('/v1/auth/signup', {
          method: 'POST',
          body,
        })
      ).data
    },

    async verifyOtp(body: { email: string; token: string }) {
      return (
        await fetchInstance<Response<VerifyOtpResponse>>(
          '/v1/auth/verify_otp',
          {
            method: 'POST',
            body,
          }
        )
      ).data
    },

    async me() {
      return (await fetchInstance<Response<Profile>>('/v1/me')).data
    },

    async logout() {
      return fetchInstance('/v1/me/logout')
    },

    async getProfileArticles(profileId: number, page = 1) {
      return (
        await fetchInstance<Response<{ articles: Article[], total: number | null }>>(
          `/v1/profile/${profileId}/articles`,
          {
            query: { page },
          }
        )
      ).data
    },

    async getProfileDrafts(profileId: number, page = 1) {
      return (
        await fetchInstance<Response<{ articles: Article[], total: number | null }>>(
          `/v1/profile/${profileId}/drafts`,
          {
            query: { page },
          }
        )
      ).data
    },

    async uploadMediaByFile(file: File) {
      const formData = new FormData()
      formData.append('file', file)

      return (
        await fetchInstance<Response<StorageMedia>>(
          '/v1/upload/media/by_file',
          {
            method: 'POST',
            body: formData,
          }
        )
      ).data
    },

    async uploadMediaByUrl(url: string) {
      return (
        await fetchInstance<Response<StorageMedia>>('/v1/upload/media/by_url', {
          method: 'POST',
          body: { url },
        })
      ).data
    },

    async getTelegramEmbed(url: string) {
      return (
        await fetchInstance<Response<SNEmbed>>('/v1/embeds/telegram', {
          query: { url },
        })
      ).data
    },

    async getXEmbed(url: string) {
      return (
        await fetchInstance<Response<SNEmbed>>('/v1/embeds/x', {
          query: { url },
        })
      ).data
    },

    async createArticle(body: ArticleBody) {
      return (
        await fetchInstance<Response<Article>>('/v1/article/create', {
          method: 'POST',
          body,
        })
      ).data
    },

    async updateArticle(id: number, body: ArticleBody) {
      return (
        await fetchInstance<Response<Article>>(`/v1/article/${id}`, {
          method: 'PATCH',
          body: { body },
        })
      ).data
    },

    async removeArticle(id: number) {
      return fetchInstance<Response>(`/v1/article/${id}`, {
        method: 'DELETE',
      })
    },

    async getArticle(id: number) {
      return (await fetchInstance<Response<Article>>(`/v1/article/${id}`)).data
    },
  }

  return {
    provide: {
      api,
    },
  }
})
