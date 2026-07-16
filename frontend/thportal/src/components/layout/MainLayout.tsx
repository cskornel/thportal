import { Outlet } from 'react-router-dom'
import { useAdat } from '../../context/AdatContext'
import { useTema } from '../../hooks/useTema'
import { Fejlec } from './Fejlec'
import { Oldalsav } from './Oldalsav'

export function MainLayout() {
  const { tema, valt } = useTema()
  const { tarsashaz, felhasznalo, koltsegvetesiEv } = useAdat()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Fejlec
        tarsashaz={tarsashaz}
        felhasznalo={felhasznalo}
        koltsegvetesiEv={koltsegvetesiEv}
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
