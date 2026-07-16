import type { Lako } from '../../model/albetetek/types'
import { JogviszonyBadge } from './JogviszonyBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('hu-HU')
}

function elerhetoseg(lako: Lako) {
  if (!lako.emailCim && !lako.mobilszam) return '—'
  return (
    <div className="flex flex-col">
      {lako.emailCim && <span>{lako.emailCim}</span>}
      {lako.mobilszam && <span>{lako.mobilszam}</span>}
    </div>
  )
}

export function LakokTable({ lakok }: { lakok: Lako[] }) {
  if (lakok.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
        Ehhez az albetéthez nincs rögzített lakó.
      </p>
    )
  }

  return (
    <div className="p-4">
      {/* Nagy képernyőn táblázat */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] overflow-hidden rounded-md border border-teal-200 bg-white text-left text-sm shadow-sm dark:border-teal-800/60 dark:bg-slate-900">
          <thead>
            <tr className="bg-teal-100/70 text-xs uppercase tracking-wide text-teal-800 dark:bg-teal-500/10 dark:text-teal-300">
              <th className="px-4 py-2 font-medium">Név</th>
              <th className="px-4 py-2 font-medium">Jogviszony</th>
              <th className="px-4 py-2 font-medium">Tul. hányad</th>
              <th className="px-4 py-2 font-medium">Jogviszony kezdete</th>
              <th className="px-4 py-2 font-medium">Elérhetőség</th>
              <th className="px-4 py-2 font-medium">Díjfizető</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-100 dark:divide-teal-900/40">
            {lakok.map((lako) => (
              <tr key={lako.id}>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {lako.nev}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {lako.jogviszonyok.map((jv) => (
                      <JogviszonyBadge key={jv} jogviszony={jv} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {lako.tulajdonosiHanyad !== null ? `${lako.tulajdonosiHanyad}%` : '—'}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {formatDate(lako.jogviszonyKezdete)}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {elerhetoseg(lako)}
                </td>
                <td className="px-4 py-3">
                  {lako.dijfizeto && (
                    <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                      Igen
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil nézetben kártyák */}
      <ul className="space-y-3 sm:hidden">
        {lakok.map((lako) => (
          <li
            key={lako.id}
            className="rounded-md border border-teal-200 bg-white p-4 shadow-sm dark:border-teal-800/60 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-slate-900 dark:text-slate-100">{lako.nev}</p>
              {lako.dijfizeto && (
                <span className="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                  Díjfizető
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {lako.jogviszonyok.map((jv) => (
                <JogviszonyBadge key={jv} jogviszony={jv} />
              ))}
            </div>

            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Tul. hányad</dt>
                <dd className="text-slate-700 dark:text-slate-200">
                  {lako.tulajdonosiHanyad !== null ? `${lako.tulajdonosiHanyad}%` : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Jogviszony kezdete</dt>
                <dd className="text-slate-700 dark:text-slate-200">
                  {formatDate(lako.jogviszonyKezdete)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Elérhetőség</dt>
                <dd className="text-right text-slate-700 dark:text-slate-200">
                  {elerhetoseg(lako)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}
