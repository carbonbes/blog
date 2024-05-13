export interface Response<T = {}> {
  success: boolean
  data?: T
  message?: string
}

export interface Profile {
  user_id: string
  id: number
  name: string
  avatar_url?: string | null
  created_at: Date
}
