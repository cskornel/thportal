import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { albetetekBazis, kezdetiEgyenlegTetelek } from '../data/albetetek/mockData'
import { kezdetiHirdetmenyek } from '../data/uzenofal/mockData'
import type { Albetet, EgyenlegTetel, RogzitesTipus } from '../model/albetetek/types'
import type { Hirdetmeny } from '../model/uzenofal/types'

export interface UjTetel {
  albetetId: number
  tipus: RogzitesTipus
  datum: string
  osszeg: number
  megjegyzes?: string
}

/** Hirdetmény adatai azonosító nélkül (új rögzítéshez és módosításhoz). */
export type HirdetmenyAdat = Omit<Hirdetmeny, 'id'>

interface AdatContextErtek {
  albetetek: Albetet[]
  egyenlegTetelekAlbetethez: (albetetId: number) => EgyenlegTetel[]
  tetelHozzaadasa: (ujTetel: UjTetel) => void
  hirdetmenyek: Hirdetmeny[]
  hirdetmenyHozzaadasa: (adat: HirdetmenyAdat) => void
  hirdetmenyModositasa: (id: string, adat: HirdetmenyAdat) => void
  hirdetmenyTorlese: (id: string) => void
}

const AdatContext = createContext<AdatContextErtek | null>(null)

/** Egy tétel egyenlegre gyakorolt hatása: a befizetés növeli, az előírás csökkenti. */
export function tetelHatasa(tetel: EgyenlegTetel): number {
  return tetel.tipus === 'befizetes' ? tetel.osszeg : -tetel.osszeg
}

export function AdatProvider({ children }: { children: ReactNode }) {
  const [tetelek, setTetelek] = useState<EgyenlegTetel[]>(kezdetiEgyenlegTetelek)
  const kovetkezoId = useRef(1)

  // Az egyenleg minden albetétnél a hozzá tartozó tételek összege.
  const albetetek = useMemo<Albetet[]>(
    () =>
      albetetekBazis.map((albetet) => ({
        ...albetet,
        egyenleg: tetelek
          .filter((tetel) => tetel.albetetId === albetet.id)
          .reduce((osszeg, tetel) => osszeg + tetelHatasa(tetel), 0),
      })),
    [tetelek],
  )

  const egyenlegTetelekAlbetethez = useCallback(
    (albetetId: number) => tetelek.filter((tetel) => tetel.albetetId === albetetId),
    [tetelek],
  )

  const tetelHozzaadasa = useCallback((ujTetel: UjTetel) => {
    setTetelek((elozo) => [
      ...elozo,
      {
        id: `felh-${kovetkezoId.current++}`,
        albetetId: ujTetel.albetetId,
        tipus: ujTetel.tipus,
        datum: ujTetel.datum,
        osszeg: ujTetel.osszeg,
        megjegyzes: ujTetel.megjegyzes,
      },
    ])
  }, [])

  const [hirdetmenyek, setHirdetmenyek] = useState<Hirdetmeny[]>(kezdetiHirdetmenyek)
  const kovetkezoHirdetmenyId = useRef(1)

  const hirdetmenyHozzaadasa = useCallback((adat: HirdetmenyAdat) => {
    setHirdetmenyek((elozo) => [
      ...elozo,
      { id: `hird-${kovetkezoHirdetmenyId.current++}`, ...adat },
    ])
  }, [])

  const hirdetmenyModositasa = useCallback((id: string, adat: HirdetmenyAdat) => {
    setHirdetmenyek((elozo) =>
      elozo.map((hirdetmeny) => (hirdetmeny.id === id ? { id, ...adat } : hirdetmeny)),
    )
  }, [])

  const hirdetmenyTorlese = useCallback((id: string) => {
    setHirdetmenyek((elozo) => elozo.filter((hirdetmeny) => hirdetmeny.id !== id))
  }, [])

  const ertek = useMemo<AdatContextErtek>(
    () => ({
      albetetek,
      egyenlegTetelekAlbetethez,
      tetelHozzaadasa,
      hirdetmenyek,
      hirdetmenyHozzaadasa,
      hirdetmenyModositasa,
      hirdetmenyTorlese,
    }),
    [
      albetetek,
      egyenlegTetelekAlbetethez,
      tetelHozzaadasa,
      hirdetmenyek,
      hirdetmenyHozzaadasa,
      hirdetmenyModositasa,
      hirdetmenyTorlese,
    ],
  )

  return <AdatContext.Provider value={ertek}>{children}</AdatContext.Provider>
}

export function useAdat(): AdatContextErtek {
  const ertek = useContext(AdatContext)
  if (!ertek) {
    throw new Error('useAdat csak AdatProvider-en belül használható.')
  }
  return ertek
}
