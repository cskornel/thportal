import { useState } from 'react'
import { useAdat } from '../../context/AdatContext'
import { HIRDETMENY_KATEGORIAK } from '../../model/uzenofal/types'
import type { HirdetmenyKategoria, HirdetmenyLathatosag } from '../../model/uzenofal/types'
import { HirdetmenyForm } from './HirdetmenyForm'
import type { HirdetmenyUrlapErtek } from './HirdetmenyForm'

const KATEGORIA_SZIN: Record<HirdetmenyKategoria, string> = {
  Általános: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300',
  Karbantartás: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  Pénzügy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  Közgyűlés: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
  Egyéb: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
}

function maiDatum(): string {
  const most = new Date()
  const ev = most.getFullYear()
  const ho = String(most.getMonth() + 1).padStart(2, '0')
  const nap = String(most.getDate()).padStart(2, '0')
  return `${ev}-${ho}-${nap}`
}

function formatDatum(iso: string): string {
  return new Date(iso).toLocaleDateString('hu-HU')
}

export function Uzenofal() {
  const {
    hirdetmenyek,
    hirdetmenyHozzaadasa,
    hirdetmenyModositasa,
    hirdetmenyTorlese,
    felhasznalo,
  } = useAdat()
  const [urlapNyitva, setUrlapNyitva] = useState(false)
  const [szerkesztettId, setSzerkesztettId] = useState<string | null>(null)
  const [nyitottLeirasok, setNyitottLeirasok] = useState<Set<string>>(new Set())
  const [lathatosagSzuro, setLathatosagSzuro] = useState<HirdetmenyLathatosag | 'mind'>('mind')
  const [kategoriaSzuro, setKategoriaSzuro] = useState<HirdetmenyKategoria | 'mind'>('mind')

  function leirasValt(id: string) {
    setNyitottLeirasok((elozo) => {
      const kovetkezo = new Set(elozo)
      if (kovetkezo.has(id)) {
        kovetkezo.delete(id)
      } else {
        kovetkezo.add(id)
      }
      return kovetkezo
    })
  }

  const szerkesztett = szerkesztettId
    ? (hirdetmenyek.find((hirdetmeny) => hirdetmeny.id === szerkesztettId) ?? null)
    : null

  const kezdoErtek: HirdetmenyUrlapErtek = szerkesztett
    ? {
        cim: szerkesztett.cim,
        kategoria: szerkesztett.kategoria,
        datum: szerkesztett.datum,
        leiras: szerkesztett.leiras,
        lathatosag: szerkesztett.lathatosag,
      }
    : { cim: '', kategoria: '', datum: maiDatum(), leiras: '', lathatosag: 'nyilvanos' }

  function ujHirdetmeny() {
    setSzerkesztettId(null)
    setUrlapNyitva(true)
  }

  function szerkeszt(id: string) {
    setSzerkesztettId(id)
    setUrlapNyitva(true)
  }

  function bezar() {
    setUrlapNyitva(false)
    setSzerkesztettId(null)
  }

  async function ment(ertek: HirdetmenyUrlapErtek) {
    const kategoria = ertek.kategoria as HirdetmenyKategoria
    if (szerkesztett) {
      // Módosításkor az eredeti rögzítő megmarad.
      await hirdetmenyModositasa(szerkesztett.id, {
        ...ertek,
        kategoria,
        rogzitoNev: szerkesztett.rogzitoNev,
        rogzitoSzerepkor: szerkesztett.rogzitoSzerepkor,
      })
    } else {
      // Új hirdetmény rögzítője a bejelentkezett felhasználó.
      await hirdetmenyHozzaadasa({
        ...ertek,
        kategoria,
        rogzitoNev: felhasznalo.nev,
        rogzitoSzerepkor: felhasznalo.szerepkor,
      })
    }
    bezar()
  }

  async function torol(id: string) {
    if (window.confirm('Biztosan törlöd ezt a hirdetményt?')) {
      await hirdetmenyTorlese(id)
    }
  }

  const rendezett = [...hirdetmenyek].sort((a, b) =>
    a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0,
  )

  const szurtek = rendezett.filter(
    (hirdetmeny) =>
      (lathatosagSzuro === 'mind' || hirdetmeny.lathatosag === lathatosagSzuro) &&
      (kategoriaSzuro === 'mind' || hirdetmeny.kategoria === kategoriaSzuro),
  )

  const szuroInputOsztaly =
    'rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Üzenőfal</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A társasház hirdetményei. Új hirdetmény rögzítéséhez használd a gombot.
          </p>
        </div>
        <button
          type="button"
          onClick={ujHirdetmeny}
          className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          + Új hirdetmény
        </button>
      </header>

      {urlapNyitva && (
        <div className="mb-6">
          <HirdetmenyForm
            key={szerkesztettId ?? 'uj'}
            kezdoErtek={kezdoErtek}
            szerkesztes={szerkesztett !== null}
            onMentes={ment}
            onMegse={bezar}
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="lathatosag-szuro"
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Láthatóság
          </label>
          <select
            id="lathatosag-szuro"
            value={lathatosagSzuro}
            onChange={(event) =>
              setLathatosagSzuro(event.target.value as HirdetmenyLathatosag | 'mind')
            }
            className={szuroInputOsztaly}
          >
            <option value="mind">Összes</option>
            <option value="nyilvanos">Nyilvános</option>
            <option value="rejtett">Rejtett</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="kategoria-szuro"
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Kategória
          </label>
          <select
            id="kategoria-szuro"
            value={kategoriaSzuro}
            onChange={(event) =>
              setKategoriaSzuro(event.target.value as HirdetmenyKategoria | 'mind')
            }
            className={szuroInputOsztaly}
          >
            <option value="mind">Összes</option>
            {HIRDETMENY_KATEGORIAK.map((kategoria) => (
              <option key={kategoria} value={kategoria}>
                {kategoria}
              </option>
            ))}
          </select>
        </div>
        <p className="ml-auto text-sm text-slate-500 dark:text-slate-400">
          {szurtek.length} / {hirdetmenyek.length} hirdetmény
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <th className="px-4 py-2.5 font-medium">Dátum</th>
              <th className="px-4 py-2.5 font-medium">Cím</th>
              <th className="px-4 py-2.5 font-medium">Kategória</th>
              <th className="px-4 py-2.5 font-medium">Leírás</th>
              <th className="px-4 py-2.5 text-right font-medium">Műveletek</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {szurtek.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                >
                  {hirdetmenyek.length === 0
                    ? 'Még nincs rögzített hirdetmény.'
                    : 'A szűrőknek nem felel meg hirdetmény.'}
                </td>
              </tr>
            ) : (
              szurtek.map((hirdetmeny) => (
                <tr key={hirdetmeny.id} className="align-top">
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="block whitespace-nowrap">{formatDatum(hirdetmeny.datum)}</span>
                    <span className="mt-0.5 block text-xs text-slate-400 dark:text-slate-500">
                      {hirdetmeny.rogzitoNev} · {hirdetmeny.rogzitoSzerepkor}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {hirdetmeny.cim}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        hirdetmeny.lathatosag === 'nyilvanos'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {hirdetmeny.lathatosag === 'nyilvanos' ? 'Nyilvános' : 'Rejtett'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${KATEGORIA_SZIN[hirdetmeny.kategoria]}`}
                    >
                      {hirdetmeny.kategoria}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {(() => {
                      const nyitva = nyitottLeirasok.has(hirdetmeny.id)
                      const hosszu = hirdetmeny.leiras.length > 120
                      return (
                        <>
                          <p
                            className={`max-w-md ${nyitva ? 'whitespace-pre-line' : 'line-clamp-2'}`}
                          >
                            {hirdetmeny.leiras}
                          </p>
                          {hosszu && (
                            <button
                              type="button"
                              onClick={() => leirasValt(hirdetmeny.id)}
                              aria-expanded={nyitva}
                              className="mt-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {nyitva ? 'Kevesebb' : 'Több'}
                            </button>
                          )}
                        </>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => szerkeszt(hirdetmeny.id)}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                      >
                        Módosítás
                      </button>
                      <button
                        type="button"
                        onClick={() => torol(hirdetmeny.id)}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        Törlés
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
