import { Outlet } from 'react-router-dom'
import { aktualisFelhasznalo, aktualisKoltsegvetesiEv, tarsashaz } from '../../data/tarsashaz/mockData'
import { useTema } from '../../hooks/useTema'
import { Fejlec } from './Fejlec'
import { Oldalsav } from './Oldalsav'

export function MainLayout() {
  const { tema, valt } = useTema()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Fejlec
        tarsashaz={tarsashaz}
        felhasznalo={aktualisFelhasznalo}
        koltsegvetesiEv={aktualisKoltsegvetesiEv}
        tema={tema}
        onTemaValt={valt}
      />

      <div className="flex flex-1 flex-col sm:flex-row">
        <Oldalsav />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
