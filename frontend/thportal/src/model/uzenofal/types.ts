export const HIRDETMENY_KATEGORIAK = [
  'Általános',
  'Karbantartás',
  'Pénzügy',
  'Közgyűlés',
  'Egyéb',
] as const

export type HirdetmenyKategoria = (typeof HIRDETMENY_KATEGORIAK)[number]

/** A hirdetmény láthatósága: nyilvános (lakók számára látható) vagy rejtett. */
export type HirdetmenyLathatosag = 'nyilvanos' | 'rejtett'

export interface Hirdetmeny {
  id: string
  cim: string
  kategoria: HirdetmenyKategoria
  /** A rögzítés dátuma ISO formátumban ('YYYY-MM-DD'). */
  datum: string
  leiras: string
  lathatosag: HirdetmenyLathatosag
  /** A hirdetményt rögzítő felhasználó neve. */
  rogzitoNev: string
  /** A rögzítő felhasználó szerepköre (pl. Közös képviselő, Gondnok, Takarító). */
  rogzitoSzerepkor: string
}
