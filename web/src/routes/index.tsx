import { createFileRoute } from '@tanstack/react-router'
import { PhoneShell, WhitePanel } from '../components/ui/PhoneShell'
import { CreateHomeForm } from '../features/home/CreateHomeForm'
import { SavedHomes } from '../features/home/SavedHomes'

export const Route = createFileRoute('/')({ component: StartPage })

function StartPage() {
  return (
    <PhoneShell>
      <header className="px-6 pt-16 pb-4">
        <p className="text-sm text-white/50">Shared home</p>
        <h1 className="mt-2 text-[40px] leading-[1.05] font-bold tracking-tight">
          Split every bill,
          <span className="text-white/40"> to the paisa.</span>
        </h1>
        <div className="mt-8 flex gap-2" aria-hidden="true">
          <span className="h-24 flex-1 rounded-2xl bg-[#FFE14D]" />
          <span className="h-24 flex-1 rounded-2xl bg-[#3EE8B5]" />
          <span className="h-24 flex-1 rounded-2xl bg-[#45A6FF]" />
        </div>
      </header>
      <WhitePanel title="Create a home">
        <CreateHomeForm />
        <SavedHomes />
      </WhitePanel>
    </PhoneShell>
  )
}
