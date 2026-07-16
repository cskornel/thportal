import { Link } from 'react-router-dom'
import type { Albetet, EgyenlegTetel } from '../../model/albetetek/types'

interface EgyenlegReszletezoProps {
  albetet: Albetet
  tetelek: EgyenlegTetel[]
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

function formatHonap(honap: string): string {
  const datum = new Date(`${honap}-01`)
  return datum.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' })
}

function formatDatum(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('hu-HU') : '—'
}

export function EgyenlegReszletezo({ albetet, tetelek }: EgyenlegReszletezoProps) {
  const osszesEloiras = tetelek.reduce((osszeg, tetel) => osszeg + tetel.eloiras, 0)
  const osszesBefizetes = tetelek.reduce((osszeg, tetel) => osszeg + tetel.befizetes, 0)
  const zaroEgyenleg = osszesBefizetes - osszesEloiras

  // A táblázat soraihoz kiszámítjuk a havi és a görgetett (kumulált) egyenleget.
  let futoEgyenleg = 0
  const sorok = tetelek.map((tetel) => {
    const haviEgyenleg = tetel.befizetes - tetel.eloiras
    futoEgyenleg += haviEgyenleg
    return { tetel, haviEgyenleg, gorgetettEgyenleg: futoEgyenleg }
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
          Egyenleg részletezése – #{albetet.albetetszam} albetét
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {albetet.lepcsohaz} lh. / {albetet.emelet}. em. / {albetet.ajto}. ·{' '}
          {albetet.helyrajziSzam} · {albetet.terulet} m²
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
              <th className="px-4 py-2.5 font-medium">Hónap</th>
              <th className="px-4 py-2.5 text-right font-medium">Fizetési kötelezettség</th>
              <th className="px-4 py-2.5 text-right font-medium">Befizetés</th>
              <th className="px-4 py-2.5 font-medium">Befizetés dátuma</th>
              <th className="px-4 py-2.5 text-right font-medium">Havi egyenleg</th>
              <th className="px-4 py-2.5 text-right font-medium">Görgetett egyenleg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorok.map(({ tetel, haviEgyenleg, gorgetettEgyenleg }) => (
              <tr key={tetel.honap}>
                <td className="px-4 py-3 font-medium text-slate-900 capitalize dark:text-slate-100">
                  {formatHonap(tetel.honap)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap text-slate-700 dark:text-slate-200">
                  {formatForint(tetel.eloiras)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap text-slate-700 dark:text-slate-200">
                  {tetel.befizetes > 0 ? formatForint(tetel.befizetes) : '—'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {formatDatum(tetel.befizetesDatuma)}
                </td>
                <td
                  className={`px-4 py-3 text-right whitespace-nowrap font-medium ${egyenlegSzin(haviEgyenleg)}`}
                >
                  {formatEgyenleg(haviEgyenleg)}
                </td>
                <td
                  className={`px-4 py-3 text-right whitespace-nowrap font-medium ${egyenlegSzin(gorgetettEgyenleg)}`}
                >
                  {formatEgyenleg(gorgetettEgyenleg)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50 font-semibold dark:border-slate-800 dark:bg-slate-800/50">
              <td className="px-4 py-3 text-slate-900 dark:text-slate-100">Összesen</td>
              <td className="px-4 py-3 text-right whitespace-nowrap text-slate-900 dark:text-slate-100">
                {formatForint(osszesEloiras)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap text-slate-900 dark:text-slate-100">
                {formatForint(osszesBefizetes)}
              </td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
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
