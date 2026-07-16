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
