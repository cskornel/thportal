import { menupontok } from '../../data/layout/menupontok'
import type { MenupontId } from '../../model/layout/types'

interface OldalsavProps {
  aktiv: MenupontId
  onValaszt: (id: MenupontId) => void
}

export function Oldalsav({ aktiv, onValaszt }: OldalsavProps) {
  return (
    <nav className="w-full shrink-0 border-b border-slate-200 bg-white p-3 sm:w-56 sm:border-r sm:border-b-0 dark:border-slate-800 dark:bg-slate-900">
      <ul className="flex gap-1 sm:flex-col">
        {menupontok.map((menupont) => {
          const kivalasztott = menupont.id === aktiv
          return (
            <li key={menupont.id}>
              <button
                type="button"
                onClick={() => onValaszt(menupont.id)}
                aria-current={kivalasztott ? 'page' : undefined}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  kivalasztott
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {menupont.cimke}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
