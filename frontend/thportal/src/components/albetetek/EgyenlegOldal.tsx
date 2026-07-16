import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getAlbetetTetelek } from '../../api/client'
import { useAdat } from '../../context/AdatContext'
import { useMunkamenet } from '../../context/MunkamenetContext'
import type { EgyenlegTetel } from '../../model/albetetek/types'
import { EgyenlegReszletezo } from './EgyenlegReszletezo'

export function EgyenlegOldal() {
  const { albetetId } = useParams<{ albetetId: string }>()
  const { albetetek, dijfizetokNeve } = useAdat()
  const { munkamenet } = useMunkamenet()
  const albetet = albetetek.find((a) => String(a.id) === albetetId)

  const [tetelek, setTetelek] = useState<EgyenlegTetel[] | null>(null)
  const [hiba, setHiba] = useState('')

  useEffect(() => {
    if (!albetet) return
    let ervenyes = true
    setTetelek(null)
    setHiba('')
    getAlbetetTetelek(albetet.id)
      .then((adat) => {
        if (ervenyes) setTetelek(adat)
      })
      .catch((error: unknown) => {
        if (ervenyes) setHiba(error instanceof Error ? error.message : 'Betöltési hiba.')
      })
    return () => {
      ervenyes = false
    }
  }, [albetet])

  // Ismeretlen vagy hibás azonosító esetén visszairányítunk a listához.
  if (!albetet) {
    return <Navigate to="/albetetek" replace />
  }

  if (hiba) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-red-600 sm:px-6 lg:px-8 dark:text-red-400">
        Nem sikerült betölteni a folyószámlát: {hiba}
      </div>
    )
  }

  if (tetelek === null) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8 dark:text-slate-400">
        Folyószámla betöltése…
      </div>
    )
  }

  return (
    <EgyenlegReszletezo
      albetet={albetet}
      tetelek={tetelek}
      dijfizeto={dijfizetokNeve(albetet.id)}
      mutatVissza={munkamenet?.szerep === 'kepviselo'}
    />
  )
}
