import type { ReactNode } from 'react'

/** Full screen on a phone; a phone-shaped frame on a wide screen. */
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh sm:py-10">
      <main className="mx-auto flex min-h-dvh max-w-[420px] flex-col overflow-hidden bg-[#0d0e10] text-white sm:min-h-[860px] sm:rounded-[48px] sm:shadow-2xl sm:ring-8 sm:ring-[#1c1c1f]">
        {children}
      </main>
    </div>
  )
}

/** The white rounded sheet that sits under the dark header. */
export function WhitePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 flex-1 rounded-t-[32px] bg-white px-4 pt-3 pb-12 text-neutral-900">
      <div className="mx-auto h-1 w-10 rounded-full bg-neutral-200" />
      <h2 className="mt-3 mb-4 text-center text-[15px] font-semibold">{title}</h2>
      {children}
    </section>
  )
}
