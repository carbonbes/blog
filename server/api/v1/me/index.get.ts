export default defineApiRoute(
  async ({ event }) => {
    return event.context.profile
  },
  { requireAuth: true }
)
