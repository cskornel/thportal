import { Link } from 'react-router-dom'
import { tetelHatasa } from '../../context/AdatContext'
import type { Albetet, EgyenlegTetel } from '../../model/albetetek/types'

interface EgyenlegReszletezoProps {
  albetet: Albetet
  tetelek: EgyenlegTetel[]
  dijfizeto: string
}

const forintFormatter = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
  maximumFractionDigits: 0,
})

function formatForint(osszeg: number): string {
  return forintFormatter.format(osszeg)
}

/** Előjeles egyenleg: a tartozás mínusz, a túlfizetés plusz előjellel. */
function formatEgyenleg(egyenleg: number): string {
  const jel = egyenleg < 0 ? '−' : egyenleg > 0 ? '+' : ''
  return `${jel}${forintFormatter.format(Math.abs(egyenleg))}`
}

function egyenlegSzin(egyenleg: number): string {
  if (egyenleg < 0) return 'text-red-600 dark:text-red-400'
  if (egyenleg > 0) return 'text-green-600 dark:text-green-400'
  return 'text-slate-600 dark:text-slate-300'
}

function formatDatum(iso: string): string {
  return new Date(iso).toLocaleDateString('hu-HU')
}

// Azonos dátumon az előírás kerül előre, majd a befizetés.
const TIPUS_SORREND: Record<EgyenlegTetel['tipus'], number> = { eloiras: 0, befizetes: 1 }

export function EgyenlegReszletezo({ albetet, tetelek, dijfizeto }: EgyenlegReszletezoProps) {
  const osszesEloiras = tetelek
    .filter((tetel) => tetel.tipus === 'eloiras')
    .reduce((osszeg, tetel) => osszeg + tetel.osszeg, 0)
  const osszesBefizetes = tetelek
    .filter((tetel) => tetel.tipus === 'befizetes')
    .reduce((osszeg, tetel) => osszeg + tetel.osszeg, 0)
  const zaroEgyenleg = osszesBefizetes - osszesEloiras

  // Dátum szerint rendezve, tételenként kiszámítjuk a görgetett egyenleget.
  const rendezett = [...tetelek].sort((a, b) => {
    if (a.datum !== b.datum) return a.datum < b.datum ? -1 : 1
    return TIPUS_SORREND[a.tipus] - TIPUS_SORREND[b.tipus]
  })
  let futoEgyenleg = 0
  const sorok = rendezett.map((tetel) => {
    futoEgyenleg += tetelHatasa(tetel)
    return { tetel, gorgetettEgyenleg: futoEgyenleg }
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/albetetek"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M14 4.5a.75.75 0 0 0-1.06.02L7.94 9.27a.75.75 0 0 0 0 1.08l4.98 4.75a.75.75 0 1 0 1.04-1.08L9.58 10l4.42-4.44A.75.75 0 0 0 14 4.5Z"
            clipRule="evenodd"
          />
        </svg>
        Vissza az albetét listához
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Folyószámla – #{albetet.albetetszam} albetét
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {albetet.lepcsohaz} lh. / {albetet.emelet}. em. / {albetet.ajto}. ·{' '}
          {albetet.helyrajziSzam} · {albetet.terulet} m²
          {dijfizeto && ` – ${dijfizeto}`}
        </p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">Összes előírás</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatForint(osszesEloiras)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">Összes befizetés</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatForint(osszesBefizetes)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">Záró egyenleg</p>
          <p className={`mt-1 text-lg font-semibold ${egyenlegSzin(zaroEgyenleg)}`}>
            {formatEgyenleg(zaroEgyenleg)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <th className="px-4 py-2.5 font-medium">Dátum</th>
              <th className="px-4 py-2.5 font-medium">Megnevezés</th>
              <th className="px-4 py-2.5 text-right font-medium">Előírás</th>
              <th className="px-4 py-2.5 text-right font-medium">Befizetés</th>
              <th className="px-4 py-2.5 text-right font-medium">Görgetett egyenleg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorok.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                >
                  Ehhez az albetéthez még nincs folyószámla-tétel.
                </td>
              </tr>
            ) : (
              sorok.map(({ tetel, gorgetettEgyenleg }) => (
                <tr key={tetel.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {formatDatum(tetel.datum)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        tetel.tipus === 'eloiras'
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300'
                      }`}
                    >
                      {tetel.tipus === 'eloiras' ? 'Előírás' : 'Befizetés'}
                    </span>
                    {tetel.megjegyzes && (
                      <span className="ml-2 text-slate-500 dark:text-slate-400">
                        {tetel.megjegyzes}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-slate-700 dark:text-slate-200">
                    {tetel.tipus === 'eloiras' ? formatForint(tetel.osszeg) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-slate-700 dark:text-slate-200">
                    {tetel.tipus === 'befizetes' ? formatForint(tetel.osszeg) : '—'}
                  </td>
                  <td
                    className={`px-4 py-3 text-right whitespace-nowrap font-medium ${egyenlegSzin(gorgetettEgyenleg)}`}
                  >
                    {formatEgyenleg(gorgetettEgyenleg)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50 font-semibold dark:border-slate-800 dark:bg-slate-800/50">
              <td className="px-4 py-3 text-slate-900 dark:text-slate-100" colSpan={2}>
                Összesen
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap text-slate-900 dark:text-slate-100">
                {formatForint(osszesEloiras)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap text-slate-900 dark:text-slate-100">
                {formatForint(osszesBefizetes)}
              </td>
              <td className={`px-4 py-3 text-right whitespace-nowrap ${egyenlegSzin(zaroEgyenleg)}`}>
                {formatEgyenleg(zaroEgyenleg)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        A negatív egyenleg tartozást, a pozitív túlfizetést jelöl.
      </p>
    </div>
  )
}
