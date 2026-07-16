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

export interface EgyenlegTetel {
  albetetId: number
  /** A hónap 'YYYY-MM' formátumban. */
  honap: string
  /** Az adott havi fizetési kötelezettség (előírás) forintban. */
  eloiras: number
  /** Az adott hónapra ténylegesen befizetett összeg forintban. */
  befizetes: number
  /** A befizetés dátuma ISO formátumban, vagy null, ha nem történt befizetés. */
  befizetesDatuma: string | null
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
