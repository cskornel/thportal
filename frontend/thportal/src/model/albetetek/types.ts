export type LakoJogviszony =
  | 'Tulajdonos'
  | 'Bérlő'
  | 'Haszonélvező'
  | 'Lakó'

export interface Lako {
  id: number
  albetetId: number
  nev: string
  jogviszonyok: LakoJogviszony[]
  tulajdonosiHanyad: number | null
  jogviszonyKezdete: string
  emailCim: string
  mobilszam: string
  dijfizeto: boolean
}

/** A rögzítés típusa: az albetéthez befizetést vagy előírást könyvelünk. */
export type RogzitesTipus = 'befizetes' | 'eloiras'

/** A folyószámla egy tétele: egy előírás vagy egy befizetés adott dátummal. */
export interface EgyenlegTetel {
  id: string
  albetetId: number
  tipus: RogzitesTipus
  /** A tétel dátuma ISO formátumban ('YYYY-MM-DD'). */
  datum: string
  /** A tétel összege forintban (mindig pozitív). */
  osszeg: number
  megjegyzes?: string
}

export interface Albetet {
  id: number
  lepcsohaz: string
  emelet: number
  ajto: string
  albetetszam: number
  helyrajziSzam: string
  terulet: number
  szoba: number
  felszoba: number
  tulajdoniJogviszony: string
  tulajdoniHanyad: string
  /** Egyenleg forintban. Negatív = tartozás, pozitív = túlfizetés, 0 = nullás egyenleg. */
  egyenleg: number
}
