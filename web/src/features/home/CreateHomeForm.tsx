import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { api } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { loadLastHome } from '../../lib/last-home'

export function CreateHomeForm() {
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const lastHome = loadLastHome()
  const create = useMutation({
    mutationFn: api.createHome,
    onSuccess: (home) => navigate({ to: '/homes/$homeId', params: { homeId: home.id } }),
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) create.mutate(name.trim())
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Flat 4B"
        aria-label="Home name"
        maxLength={100}
        className="rounded-2xl bg-neutral-100 px-4 py-3.5 text-center outline-none focus:ring-2 focus:ring-neutral-900"
      />
      {create.isError && (
        <p role="alert" className="text-center text-sm text-red-600">
          {create.error.message}
        </p>
      )}
      <Button
        type="submit"
        variant="solid"
        className="py-3.5"
        disabled={!name.trim() || create.isPending}
      >
        {create.isPending ? 'Creating…' : 'Create home'}
      </Button>
      {lastHome && (
        <Link
          to="/homes/$homeId"
          params={{ homeId: lastHome.id }}
          className="mt-2 text-center text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          Continue to {lastHome.name} →
        </Link>
      )}
    </form>
  )
}
