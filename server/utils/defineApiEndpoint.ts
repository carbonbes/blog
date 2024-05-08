import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineApiEndpoint = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      const response = await handler(event)

      return { success: true, data: response }
    } catch (err: any) {
      setResponseStatus(event, err.status)
      return { success: false, message: err.message }
    }
  })
