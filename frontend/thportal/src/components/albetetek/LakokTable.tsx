import type { Lako } from '../../model/albetetek/types'
import { JogviszonyBadge } from './JogviszonyBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('hu-HU')
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
    <div className="overflow-x-auto p-4">
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
                {lako.emailCim || lako.mobilszam ? (
                  <div className="flex flex-col">
                    {lako.emailCim && <span>{lako.emailCim}</span>}
                    {lako.mobilszam && <span>{lako.mobilszam}</span>}
                  </div>
                ) : (
                  '—'
                )}
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
  )
}
