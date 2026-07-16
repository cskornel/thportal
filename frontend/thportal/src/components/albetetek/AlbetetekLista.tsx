import { useState } from 'react'
import { useAdat } from '../../context/AdatContext'
import { AlbetetSor } from './AlbetetSor'

export function AlbetetekLista() {
  const { albetetek, lakok } = useAdat()
  const [nyitottIdk, setNyitottIdk] = useState<Set<number>>(new Set())

  function toggle(id: number) {
    setNyitottIdk((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Albetétek
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {albetetek.length} db albetét van a társasházban. Kattints egy sorra a hozzá tartozó lakók
          megjelenítéséhez.
        </p>
      </header>

      <ul className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {albetetek.map((albetet) => (
          <AlbetetSor
            key={albetet.id}
            albetet={albetet}
            lakok={lakok.filter((lako) => lako.albetetId === albetet.id)}
            expanded={nyitottIdk.has(albetet.id)}
            onToggle={() => toggle(albetet.id)}
          />
        ))}
      </ul>
    </div>
  )
}
