import type { Tema } from '../../hooks/useTema'
import type { Felhasznalo, Tarsashaz } from '../../model/tarsashaz/types'
import { TemaValto } from './TemaValto'

interface FejlecProps {
  tarsashaz: Tarsashaz
  felhasznalo: Felhasznalo
  koltsegvetesiEv: number
  tema: Tema
  onTemaValt: () => void
}

function monogram(nev: string): string {
  return nev
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((resz) => resz[0]?.toUpperCase() ?? '')
    .join('')
}

export function Fejlec({
  tarsashaz,
  felhasznalo,
  koltsegvetesiEv,
  tema,
  onTemaValt,
}: FejlecProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
            {tarsashaz.nev}
          </h1>
          <span
            className="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 ring-inset dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20"
            title="A jelenleg kezelt költségvetési év"
          >
            Költségvetési év: {koltsegvetesiEv}
          </span>
        </div>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">{tarsashaz.cim}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {felhasznalo.nev}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{felhasznalo.szerepkor}</p>
        </div>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
          title={`${felhasznalo.nev} (${felhasznalo.email})`}
        >
          {monogram(felhasznalo.nev)}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

        <TemaValto tema={tema} onValt={onTemaValt} />
      </div>
    </header>
  )
}
