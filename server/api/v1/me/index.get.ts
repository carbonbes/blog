export default defineApiEndpoint(
  async ({ event }) => {
    return event.context.profile
  },
  { requireAuth: true }
)
