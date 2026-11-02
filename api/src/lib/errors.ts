import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

/** An expected error. Its status and message are sent to the client as-is. */
export class ApiError extends Error {
  constructor(
    readonly status: ContentfulStatusCode,
    message: string,
  ) {
    super(message)
  }
}

export const notFound = (what: string) => new ApiError(404, `${what} not found`)

/** Every error leaves the API as JSON: { "error": "message" }. */
export function onError(err: Error, c: Context) {
  if (err instanceof ApiError) return c.json({ error: err.message }, err.status)
  console.error(err)
  return c.json({ error: 'Something went wrong' }, 500)
}

export const onNotFound = (c: Context) => c.json({ error: 'Route not found' }, 404)
