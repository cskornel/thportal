import { Link } from 'react-router-dom'
import type { Albetet, Lako } from '../../model/albetetek/types'
import { LakokTable } from './LakokTable'

interface AlbetetSorProps {
  albetet: Albetet
  lakok: Lako[]
  expanded: boolean
  onToggle: () => void
}

const forintFormatter = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
  maximumFractionDigits: 0,
})

function formatEgyenleg(egyenleg: number) {
  // A tartozás negatív előjelű; a felhasználónak abszolút összegként jelenítjük meg.
  return forintFormatter.format(Math.abs(egyenleg))
}

function egyenlegSzin(egyenleg: number): string {
  if (egyenleg < 0) return 'text-red-600 dark:text-red-400'
  if (egyenleg > 0) return 'text-green-600 dark:text-green-400'
  return 'text-slate-600 dark:text-slate-300'
}

export function AlbetetSor({ albetet, lakok, expanded, onToggle }: AlbetetSorProps) {
  const panelId = `albetet-panel-${albetet.id}`

  return (
    <li className="border-b border-slate-200 last:border-b-0 dark:border-slate-800">
      <div
        className={`flex items-stretch border-l-4 ${
          expanded
            ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/40'
            : 'border-transparent bg-white dark:bg-slate-900'
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className={`flex min-w-0 flex-1 items-center gap-4 px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${
            expanded ? '' : 'hover:bg-indigo-50/60 dark:hover:bg-indigo-950/20'
          }`}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 flex-none text-slate-400 transition-transform ${
              expanded ? 'rotate-90' : ''
            }`}
          >
            <path
              fillRule="evenodd"
              d="M6 4.5a.75.75 0 0 1 1.06-.02l5 4.75a.75.75 0 0 1 0 1.08l-5 4.75a.75.75 0 1 1-1.04-1.08L10.42 10 6.02 5.56A.75.75 0 0 1 6 4.5Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-5 lg:grid-cols-[0.7fr_1.5fr_0.9fr_0.7fr_0.8fr_1.3fr_0.95fr]">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">Albetét</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                #{albetet.albetetszam}
              </p>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">Elhelyezkedés</p>
              <p className="whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                {albetet.lepcsohaz} lh. / {albetet.emelet}. em. / {albetet.ajto}.
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hrsz.</p>
              <p className="whitespace-nowrap text-slate-700 dark:text-slate-200">
                {albetet.helyrajziSzam}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Terület</p>
              <p className="whitespace-nowrap text-slate-700 dark:text-slate-200">
                {albetet.terulet} m²
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Szoba</p>
              <p className="whitespace-nowrap text-slate-700 dark:text-slate-200">
                {albetet.szoba} + {albetet.felszoba} fél
              </p>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">Tulajdoni jogviszony</p>
              <p className="whitespace-nowrap text-slate-700 dark:text-slate-200">
                {albetet.tulajdoniJogviszony}
              </p>
            </div>
            <div>
              <p className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                Tul. hányad
              </p>
              <p className="whitespace-nowrap text-slate-700 dark:text-slate-200">
                {albetet.tulajdoniHanyad}
              </p>
            </div>
          </div>

          <span className="flex-none rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
            {lakok.length} lakó
          </span>
        </button>

        <Link
          to={`/albetetek/${albetet.id}/egyenleg`}
          aria-label={`Egyenleg részletezése: #${albetet.albetetszam} albetét`}
          title="Kattints az egyenleg részletezéséhez"
          className="flex flex-none flex-col items-end justify-center gap-0.5 border-l border-slate-200 px-4 py-3 text-right transition-colors hover:bg-indigo-50/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-slate-800 dark:hover:bg-indigo-950/20"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400">Egyenleg</span>
          <span className={`whitespace-nowrap font-medium ${egyenlegSzin(albetet.egyenleg)}`}>
            {albetet.egyenleg < 0 && '−'}
            {formatEgyenleg(albetet.egyenleg)}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            Részletek
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M6 4.5a.75.75 0 0 1 1.06-.02l5 4.75a.75.75 0 0 1 0 1.08l-5 4.75a.75.75 0 1 1-1.04-1.08L10.42 10 6.02 5.56A.75.75 0 0 1 6 4.5Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </Link>
      </div>

      {expanded && (
        <div
          id={panelId}
          className="border-l-4 border-teal-400 bg-teal-50/70 dark:border-teal-500/60 dark:bg-teal-950/10"
        >
          <p className="px-4 pt-3 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            Lakók
          </p>
          <LakokTable lakok={lakok} />
        </div>
      )}
    </li>
  )
}
