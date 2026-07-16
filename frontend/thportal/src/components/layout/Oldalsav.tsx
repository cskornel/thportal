import { NavLink } from 'react-router-dom'
import { useMunkamenet } from '../../context/MunkamenetContext'

interface Menupont {
  cimke: string
  utvonal: string
}

export function Oldalsav() {
  const { munkamenet } = useMunkamenet()

  const menupontok: Menupont[] =
    munkamenet?.szerep === 'kepviselo'
      ? [
          { cimke: 'Albetét lista', utvonal: '/albetetek' },
          { cimke: 'Befizetések', utvonal: '/befizetesek' },
          { cimke: 'Üzenőfal', utvonal: '/uzenofal' },
        ]
      : [
          { cimke: 'Folyószámla', utvonal: `/albetetek/${munkamenet?.albetetId}/egyenleg` },
          { cimke: 'Üzenőfal', utvonal: '/uzenofal' },
        ]

  return (
    <nav className="w-full shrink-0 border-b border-slate-200 bg-white p-3 sm:w-56 sm:border-r sm:border-b-0 dark:border-slate-800 dark:bg-slate-900">
      <ul className="flex gap-1 sm:flex-col">
        {menupontok.map((menupont) => (
          <li key={menupont.utvonal}>
            <NavLink
              to={menupont.utvonal}
              className={({ isActive }) =>
                `block w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {menupont.cimke}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
