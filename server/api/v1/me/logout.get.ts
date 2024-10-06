export default defineApiRoute(
  async ({ event, supabase }) => {
    const { error } = await supabase.auth.signOut({ scope: 'local' })

    if (error)
      throw createError({ statusCode: 400, message: 'Не удалось выйти' })

    deleteCookie(event, 'sb-access-token')
    deleteCookie(event, 'sb-refresh-token')
  },
  { requireAuth: true }
)
