const TIMEOUT_MS = 10_000

/** status 0 means the request never got an answer (offline or timed out). */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

/** fetch + timeout + one error type. Never throws anything but HttpError. */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      headers: { 'content-type': 'application/json', ...init.headers },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'TimeoutError'
    throw new HttpError(
      0,
      timedOut ? 'The server is taking too long.' : 'Could not reach the server.',
    )
  }

  const body: unknown = await res.json().catch(() => null)
  if (!res.ok) throw new HttpError(res.status, messageFrom(body, res.status))
  return body as T
}

function messageFrom(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error
  }
  return status >= 500 ? 'The server had a problem.' : `Request failed (${status}).`
}

/** Worth retrying: no answer, or the server broke. A 4xx will not fix itself. */
export const isTemporary = (err: unknown) =>
  err instanceof HttpError && (err.status === 0 || err.status >= 500)
