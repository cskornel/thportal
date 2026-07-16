import { Navigate, useParams } from 'react-router-dom'
import { useAdat } from '../../context/AdatContext'
import { EgyenlegReszletezo } from './EgyenlegReszletezo'

export function EgyenlegOldal() {
  const { albetetId } = useParams<{ albetetId: string }>()
  const { albetetek, egyenlegTetelekAlbetethez } = useAdat()
  const albetet = albetetek.find((a) => String(a.id) === albetetId)

  // Ismeretlen vagy hibás azonosító esetén visszairányítunk a listához.
  if (!albetet) {
    return <Navigate to="/albetetek" replace />
  }

  return (
    <EgyenlegReszletezo albetet={albetet} tetelek={egyenlegTetelekAlbetethez(albetet.id)} />
  )
}
