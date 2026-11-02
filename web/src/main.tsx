import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PhoneShell } from './components/ui/PhoneShell'
import { ErrorState } from './components/ui/states'
import { queryClient } from './lib/query-client'
import { routeTree } from './routeTree.gen'
import './styles.css'

const router = createRouter({
  routeTree,
  // Last safety net: a render error shows a message instead of a blank page.
  defaultErrorComponent: ({ error, reset }) => (
    <PhoneShell>
      <ErrorState
        dark
        message={error instanceof Error ? error.message : 'Unknown error'}
        onRetry={reset}
      />
    </PhoneShell>
  ),
  defaultNotFoundComponent: () => (
    <PhoneShell>
      <ErrorState dark message="This page does not exist." />
    </PhoneShell>
  ),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('root element missing')

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
