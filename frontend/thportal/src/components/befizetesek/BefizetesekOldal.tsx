import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdat } from '../../context/AdatContext'
import { dijfizetokNeve } from '../../data/albetetek/mockData'
import type { Albetet, RogzitesTipus } from '../../model/albetetek/types'

const forintFormatter = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
  maximumFractionDigits: 0,
})

function albetetCimke(albetet: Albetet): string {
  return `#${albetet.albetetszam} – ${albetet.lepcsohaz} lh. / ${albetet.emelet}. em. / ${albetet.ajto}.`
}

/** Előjeles egyenleg: a tartozás mínusz, a túlfizetés plusz előjellel. */
function formatEgyenleg(egyenleg: number): string {
  const jel = egyenleg < 0 ? '−' : egyenleg > 0 ? '+' : ''
  return `${jel}${forintFormatter.format(Math.abs(egyenleg))}`
}

function egyenlegSzin(egyenleg: number): string {
  if (egyenleg < 0) return 'text-red-600 dark:text-red-400'
  if (egyenleg > 0) return 'text-green-600 dark:text-green-400'
  return 'text-slate-600 dark:text-slate-300'
}

/** A legördülő opció felirata: az albetét azonosítója és a díjfizető neve kötőjellel. */
function albetetOpcioCimke(albetet: Albetet): string {
  const dijfizeto = dijfizetokNeve(albetet.id)
  return dijfizeto ? `${albetetCimke(albetet)} – ${dijfizeto}` : albetetCimke(albetet)
}

const inputOsztaly =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

const labelOsztaly = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'

/** A rögzített tétel visszaigazolása. */
interface Nyugta {
  albetetId: number
  albetetCimke: string
  tipus: RogzitesTipus
  datum: string
  osszeg: number
  megjegyzes: string
}

export function BefizetesekOldal() {
  const { albetetek, tetelHozzaadasa } = useAdat()
  const navigate = useNavigate()
  const [nyugta, setNyugta] = useState<Nyugta | null>(null)

  const form = useForm({
    defaultValues: {
      albetetId: '',
      tipus: 'befizetes' as RogzitesTipus,
      datum: '',
      osszeg: '',
      megjegyzes: '',
    },
    onSubmit: async ({ value }) => {
      const albetetId = Number(value.albetetId)
      const albetet = albetetek.find((a) => a.id === albetetId)
      const osszeg = Number(value.osszeg)
      const megjegyzes = value.megjegyzes.trim()

      tetelHozzaadasa({
        albetetId,
        tipus: value.tipus,
        datum: value.datum,
        osszeg,
        megjegyzes: megjegyzes || undefined,
      })

      setNyugta({
        albetetId,
        albetetCimke: albetet ? albetetCimke(albetet) : value.albetetId,
        tipus: value.tipus,
        datum: value.datum,
        osszeg,
        megjegyzes,
      })
      form.reset()
    },
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Befizetések</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Befizetés vagy előírás rögzítése egy albetéthez.
        </p>
      </header>

      {nyugta && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
          <div>
            <p className="font-semibold">Sikeresen rögzítve</p>
            <p className="mt-1">
              {nyugta.tipus === 'befizetes' ? 'Befizetés' : 'Előírás'} ·{' '}
              {nyugta.albetetCimke} · {new Date(nyugta.datum).toLocaleDateString('hu-HU')} ·{' '}
              {forintFormatter.format(nyugta.osszeg)}
              {nyugta.megjegyzes && ` · „${nyugta.megjegyzes}”`}
            </p>
            <Link
              to={`/albetetek/${nyugta.albetetId}/egyenleg`}
              className="mt-2 inline-flex items-center gap-1 font-medium text-emerald-800 underline underline-offset-2 hover:text-emerald-900 dark:text-emerald-200 dark:hover:text-emerald-100"
            >
              Folyószámla megtekintése →
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setNyugta(null)}
            aria-label="Visszaigazolás bezárása"
            className="shrink-0 rounded-md px-2 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
          >
            ×
          </button>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        noValidate
        className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <form.Field
          name="albetetId"
          validators={{
            onChange: ({ value }) => (value === '' ? 'Válassz albetétet.' : undefined),
          }}
        >
          {(field) => {
            const kivalasztottAlbetet = albetetek.find(
              (albetet) => String(albetet.id) === field.state.value,
            )
            return (
            <div>
              <label htmlFor={field.name} className={labelOsztaly}>
                Albetét
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                className={inputOsztaly}
              >
                <option value="">Válassz albetétet…</option>
                {albetetek.map((albetet) => (
                  <option key={albetet.id} value={String(albetet.id)}>
                    {albetetOpcioCimke(albetet)}
                  </option>
                ))}
              </select>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
              {kivalasztottAlbetet && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Aktuális egyenleg:{' '}
                  <span className={`font-semibold ${egyenlegSzin(kivalasztottAlbetet.egyenleg)}`}>
                    {formatEgyenleg(kivalasztottAlbetet.egyenleg)}
                  </span>
                </p>
              )}
            </div>
            )
          }}
        </form.Field>

        <form.Field name="tipus">
          {(field) => (
            <div>
              <span className={labelOsztaly}>Rögzítés típusa</span>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { ertek: 'befizetes', cimke: 'Befizetés' },
                    { ertek: 'eloiras', cimke: 'Előírás' },
                  ] as const
                ).map((opcio) => {
                  const kivalasztott = field.state.value === opcio.ertek
                  return (
                    <label
                      key={opcio.ertek}
                      className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        kivalasztott
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={opcio.ertek}
                        checked={kivalasztott}
                        onChange={() => field.handleChange(opcio.ertek)}
                        onBlur={field.handleBlur}
                        className="sr-only"
                      />
                      {opcio.cimke}
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </form.Field>

        <form.Field
          name="datum"
          validators={{
            onChange: ({ value }) => (value === '' ? 'Add meg a dátumot.' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className={labelOsztaly}>
                Dátum
              </label>
              <input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                className={inputOsztaly}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="osszeg"
          validators={{
            onChange: ({ value }) => {
              if (value.trim() === '') return 'Add meg az összeget.'
              const szam = Number(value)
              if (!Number.isFinite(szam) || szam <= 0) {
                return 'Az összegnek pozitív számnak kell lennie.'
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className={labelOsztaly}>
                Összeg (Ft)
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                className={inputOsztaly}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="megjegyzes"
          validators={{
            onChange: ({ value }) =>
              value.length > 300 ? 'A megjegyzés legfeljebb 300 karakter lehet.' : undefined,
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className={labelOsztaly}>
                Megjegyzés <span className="text-slate-400">(opcionális)</span>
              </label>
              <textarea
                id={field.name}
                name={field.name}
                rows={3}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                className={`${inputOsztaly} resize-y`}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <div className="flex items-center gap-3 pt-2">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Rögzítés…' : 'Rögzítés'}
              </button>
            )}
          </form.Subscribe>
          <button
            type="button"
            onClick={() => navigate('/albetetek')}
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Mégse
          </button>
        </div>
      </form>
    </div>
  )
}
