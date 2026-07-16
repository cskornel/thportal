export type Szerep = 'kepviselo' | 'lako'

export interface Munkamenet {
  szerep: Szerep
  nev: string
  email: string
  szerepkor: string
  /** Lakó esetén a saját albetét azonosítója; közös képviselőnél null. */
  albetetId: number | null
}
