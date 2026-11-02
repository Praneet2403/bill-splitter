import type { Context } from 'hono'
import type { z } from 'zod'
import { ApiError } from './errors'

/** Reads the JSON body and checks it against a schema. 400 = not JSON, 422 = wrong shape. */
export async function readBody<T>(c: Context, schema: z.ZodType<T>): Promise<T> {
  let json: unknown
  try {
    json = await c.req.json()
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON')
  }

  const result = schema.safeParse(json)
  if (!result.success) {
    const issue = result.error.issues[0]
    const field = issue?.path.join('.')
    throw new ApiError(422, field ? `${field}: ${issue?.message}` : 'Invalid request body')
  }
  return result.data
}
