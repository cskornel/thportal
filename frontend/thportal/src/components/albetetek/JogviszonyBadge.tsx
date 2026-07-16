import type { LakoJogviszony } from '../../model/albetetek/types'

const STYLES: Record<LakoJogviszony, string> = {
  Tulajdonos: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
  Bérlő: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  Haszonélvező: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  Lakó: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
}

export function JogviszonyBadge({ jogviszony }: { jogviszony: LakoJogviszony }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[jogviszony]}`}
    >
      {jogviszony}
    </span>
  )
}
