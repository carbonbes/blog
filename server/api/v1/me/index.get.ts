export default defineApiRoute(
  async ({ event }) => {
    return event.context.user
  },
  { requireAuth: true }
)
