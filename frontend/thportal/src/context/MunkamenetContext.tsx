import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { postLogin } from '../api/client'
import type { Munkamenet } from '../model/auth/types'

const TAROLASI_KULCS = 'thportal-munkamenet'

interface MunkamenetContextErtek {
  munkamenet: Munkamenet | null
  bejelentkezes: (email: string, jelszo: string) => Promise<Munkamenet>
  kijelentkezes: () => void
}

const MunkamenetContext = createContext<MunkamenetContextErtek | null>(null)

function mentettMunkamenet(): Munkamenet | null {
  try {
    const nyers = localStorage.getItem(TAROLASI_KULCS)
    return nyers ? (JSON.parse(nyers) as Munkamenet) : null
  } catch {
    return null
  }
}

export function MunkamenetProvider({ children }: { children: ReactNode }) {
  const [munkamenet, setMunkamenet] = useState<Munkamenet | null>(mentettMunkamenet)

  const bejelentkezes = useCallback(async (email: string, jelszo: string) => {
    const uj = await postLogin(email, jelszo)
    localStorage.setItem(TAROLASI_KULCS, JSON.stringify(uj))
    setMunkamenet(uj)
    return uj
  }, [])

  const kijelentkezes = useCallback(() => {
    localStorage.removeItem(TAROLASI_KULCS)
    setMunkamenet(null)
  }, [])

  return (
    <MunkamenetContext.Provider value={{ munkamenet, bejelentkezes, kijelentkezes }}>
      {children}
    </MunkamenetContext.Provider>
  )
}

export function useMunkamenet(): MunkamenetContextErtek {
  const ertek = useContext(MunkamenetContext)
  if (!ertek) {
    throw new Error('useMunkamenet csak MunkamenetProvider-en belül használható.')
  }
  return ertek
}
