import { useState } from 'react'
import { AlbetetekLista } from './components/albetetek/AlbetetekLista'
import { Fejlec } from './components/layout/Fejlec'
import { Oldalsav } from './components/layout/Oldalsav'
import { Uzenofal } from './components/uzenofal/Uzenofal'
import { aktualisFelhasznalo, aktualisKoltsegvetesiEv, tarsashaz } from './data/tarsashaz/mockData'
import { useTema } from './hooks/useTema'
import type { MenupontId } from './model/layout/types'

function App() {
  const [aktivMenupont, setAktivMenupont] = useState<MenupontId>('albetetek')
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
        <Oldalsav aktiv={aktivMenupont} onValaszt={setAktivMenupont} />

        <main className="min-w-0 flex-1">
          {aktivMenupont === 'albetetek' && <AlbetetekLista />}
          {aktivMenupont === 'uzenofal' && <Uzenofal />}
        </main>
      </div>
    </div>
  )
}

export default App
