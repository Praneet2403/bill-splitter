import { type FormEvent, useState } from 'react'
import { useAddMember } from '../../api/queries'
import { Button } from '../../components/ui/Button'
import { Sheet } from '../../components/ui/Sheet'

export function AddMemberSheet({ homeId, onClose }: { homeId: string; onClose: () => void }) {
  const [name, setName] = useState('')
  const addMember = useAddMember(homeId)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) addMember.mutate(name.trim(), { onSuccess: onClose })
  }

  return (
    <Sheet label="Add member" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4 pt-6">
        <h2 className="text-center text-lg font-semibold">Add member</h2>
        <p className="-mt-3 text-center text-xs text-neutral-400">
          Members who join earlier get the extra cents first.
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          aria-label="Member name"
          maxLength={100}
          className="rounded-2xl bg-neutral-100 px-4 py-3.5 text-center outline-none focus:ring-2 focus:ring-neutral-900"
        />
        {addMember.isError && (
          <p role="alert" className="text-center text-sm text-red-600">
            {addMember.error.message}
          </p>
        )}
        <Button
          type="submit"
          variant="solid"
          className="py-3.5"
          disabled={!name.trim() || addMember.isPending}
        >
          {addMember.isPending ? 'Adding…' : 'Add member'}
        </Button>
      </form>
    </Sheet>
  )
}
