export default defineApiEndpoint(
  async ({ supabase }) => {
    const { error } = await supabase.auth.signOut({ scope: 'local' })

    if (error)
      throw createError({ statusCode: 400, message: 'Не удалось выйти' })
  },
  { requireAuth: true }
)
