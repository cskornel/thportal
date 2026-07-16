import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  deleteHirdetmeny,
  getAlbetetek,
  getFelhasznalo,
  getHirdetmenyek,
  getKoltsegvetesiEv,
  getLakok,
  getTarsashaz,
  postHirdetmeny,
  postTetel,
  putHirdetmeny,
} from '../api/client'
import type { HirdetmenyAdat, UjTetelKeres } from '../api/client'
import type { Albetet, EgyenlegTetel, Lako } from '../model/albetetek/types'
import type { Felhasznalo, Tarsashaz } from '../model/tarsashaz/types'
import type { Hirdetmeny } from '../model/uzenofal/types'

interface AdatContextErtek {
  tarsashaz: Tarsashaz
  felhasznalo: Felhasznalo
  koltsegvetesiEv: number
  albetetek: Albetet[]
  lakok: Lako[]
  hirdetmenyek: Hirdetmeny[]
  dijfizetokNeve: (albetetId: number) => string
  tetelHozzaadasa: (adat: UjTetelKeres) => Promise<void>
  hirdetmenyHozzaadasa: (adat: HirdetmenyAdat) => Promise<void>
  hirdetmenyModositasa: (id: string, adat: HirdetmenyAdat) => Promise<void>
  hirdetmenyTorlese: (id: string) => Promise<void>
}

const AdatContext = createContext<AdatContextErtek | null>(null)

/** Egy tétel egyenlegre gyakorolt hatása: a befizetés növeli, az előírás csökkenti. */
export function tetelHatasa(tetel: EgyenlegTetel): number {
  return tetel.tipus === 'befizetes' ? tetel.osszeg : -tetel.osszeg
}

export function AdatProvider({ children }: { children: ReactNode }) {
  const [tarsashaz, setTarsashaz] = useState<Tarsashaz | null>(null)
  const [felhasznalo, setFelhasznalo] = useState<Felhasznalo | null>(null)
  const [koltsegvetesiEv, setKoltsegvetesiEv] = useState<number | null>(null)
  const [albetetek, setAlbetetek] = useState<Albetet[]>([])
  const [lakok, setLakok] = useState<Lako[]>([])
  const [hirdetmenyek, setHirdetmenyek] = useState<Hirdetmeny[]>([])
  const [allapot, setAllapot] = useState<'toltes' | 'kesz' | 'hiba'>('toltes')
  const [hibaUzenet, setHibaUzenet] = useState('')

  const betolt = useCallback(async () => {
    setAllapot('toltes')
    try {
      const [th, fh, ev, ab, lk, hd] = await Promise.all([
        getTarsashaz(),
        getFelhasznalo(),
        getKoltsegvetesiEv(),
        getAlbetetek(),
        getLakok(),
        getHirdetmenyek(),
      ])
      setTarsashaz(th)
      setFelhasznalo(fh)
      setKoltsegvetesiEv(ev.ev)
      setAlbetetek(ab)
      setLakok(lk)
      setHirdetmenyek(hd)
      setAllapot('kesz')
    } catch (error) {
      setHibaUzenet(error instanceof Error ? error.message : 'Ismeretlen hiba történt.')
      setAllapot('hiba')
    }
  }, [])

  useEffect(() => {
    void betolt()
  }, [betolt])

  const frissitAlbetetek = useCallback(async () => {
    setAlbetetek(await getAlbetetek())
  }, [])

  const frissitHirdetmenyek = useCallback(async () => {
    setHirdetmenyek(await getHirdetmenyek())
  }, [])

  const dijfizetokNeve = useCallback(
    (albetetId: number) =>
      lakok
        .filter((lako) => lako.albetetId === albetetId && lako.dijfizeto)
        .map((lako) => lako.nev)
        .join(', '),
    [lakok],
  )

  const tetelHozzaadasa = useCallback(
    async (adat: UjTetelKeres) => {
      await postTetel(adat)
      await frissitAlbetetek()
    },
    [frissitAlbetetek],
  )

  const hirdetmenyHozzaadasa = useCallback(
    async (adat: HirdetmenyAdat) => {
      await postHirdetmeny(adat)
      await frissitHirdetmenyek()
    },
    [frissitHirdetmenyek],
  )

  const hirdetmenyModositasa = useCallback(
    async (id: string, adat: HirdetmenyAdat) => {
      await putHirdetmeny(id, adat)
      await frissitHirdetmenyek()
    },
    [frissitHirdetmenyek],
  )

  const hirdetmenyTorlese = useCallback(
    async (id: string) => {
      await deleteHirdetmeny(id)
      await frissitHirdetmenyek()
    },
    [frissitHirdetmenyek],
  )

  if (allapot === 'toltes') {
    return <AllapotKepernyo>Adatok betöltése…</AllapotKepernyo>
  }

  if (allapot === 'hiba' || !tarsashaz || !felhasznalo || koltsegvetesiEv === null) {
    return (
      <AllapotKepernyo>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          Nem sikerült betölteni az adatokat.
        </p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{hibaUzenet}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Fut a backend a http://localhost:3000 címen?
        </p>
        <button
          type="button"
          onClick={() => void betolt()}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Újrapróbálom
        </button>
      </AllapotKepernyo>
    )
  }

  const ertek: AdatContextErtek = {
    tarsashaz,
    felhasznalo,
    koltsegvetesiEv,
    albetetek,
    lakok,
    hirdetmenyek,
    dijfizetokNeve,
    tetelHozzaadasa,
    hirdetmenyHozzaadasa,
    hirdetmenyModositasa,
    hirdetmenyTorlese,
  }

  return <AdatContext.Provider value={ertek}>{children}</AdatContext.Provider>
}

function AllapotKepernyo({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="text-center text-slate-600 dark:text-slate-300">{children}</div>
    </div>
  )
}

export function useAdat(): AdatContextErtek {
  const ertek = useContext(AdatContext)
  if (!ertek) {
    throw new Error('useAdat csak AdatProvider-en belül használható.')
  }
  return ertek
}
