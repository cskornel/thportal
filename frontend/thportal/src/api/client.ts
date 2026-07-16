import type { Albetet, EgyenlegTetel, Lako, RogzitesTipus } from '../model/albetetek/types'
import type { Munkamenet } from '../model/auth/types'
import type { Felhasznalo, Tarsashaz } from '../model/tarsashaz/types'
import type { Hirdetmeny } from '../model/uzenofal/types'

const ALAP = '/api'

async function keres<T>(utvonal: string, opciok?: RequestInit): Promise<T> {
  const valasz = await fetch(`${ALAP}${utvonal}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciok,
  })

  if (!valasz.ok) {
    let uzenet = `A kérés sikertelen (HTTP ${valasz.status}).`
    try {
      const test = await valasz.json()
      if (test?.hiba) uzenet = test.hiba
    } catch {
      // A válasz nem JSON – marad az alapértelmezett üzenet.
    }
    throw new Error(uzenet)
  }

  if (valasz.status === 204) return undefined as T
  return (await valasz.json()) as T
}

// --- Törzsadatok ---
export const getTarsashaz = () => keres<Tarsashaz>('/tarsashaz')
export const getFelhasznalo = () => keres<Felhasznalo>('/felhasznalo')
export const getKoltsegvetesiEv = () => keres<{ ev: number }>('/koltsegvetesi-ev')
export const getLakok = () => keres<Lako[]>('/lakok')

// --- Bejelentkezés ---
export const postLogin = (email: string, jelszo: string) =>
  keres<Munkamenet>('/login', { method: 'POST', body: JSON.stringify({ email, jelszo }) })

// --- Albetétek / folyószámla ---
export const getAlbetetek = () => keres<Albetet[]>('/albetetek')
export const getAlbetet = (albetetId: number) => keres<Albetet>(`/albetetek/${albetetId}`)
export const getAlbetetTetelek = (albetetId: number) =>
  keres<EgyenlegTetel[]>(`/albetetek/${albetetId}/tetelek`)

export interface UjTetelKeres {
  albetetId: number
  tipus: RogzitesTipus
  datum: string
  osszeg: number
  megjegyzes?: string
}

export const postTetel = (adat: UjTetelKeres) =>
  keres<EgyenlegTetel>('/tetelek', { method: 'POST', body: JSON.stringify(adat) })

// --- Hirdetmények ---
export type HirdetmenyAdat = Omit<Hirdetmeny, 'id'>

export const getHirdetmenyek = () => keres<Hirdetmeny[]>('/hirdetmenyek')
export const postHirdetmeny = (adat: HirdetmenyAdat) =>
  keres<Hirdetmeny>('/hirdetmenyek', { method: 'POST', body: JSON.stringify(adat) })
export const putHirdetmeny = (id: string, adat: HirdetmenyAdat) =>
  keres<Hirdetmeny>(`/hirdetmenyek/${id}`, { method: 'PUT', body: JSON.stringify(adat) })
export const deleteHirdetmeny = (id: string) =>
  keres<void>(`/hirdetmenyek/${id}`, { method: 'DELETE' })
