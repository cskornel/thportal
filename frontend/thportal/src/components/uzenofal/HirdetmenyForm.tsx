import { useForm } from '@tanstack/react-form'
import { HIRDETMENY_KATEGORIAK } from '../../model/uzenofal/types'
import type { HirdetmenyLathatosag } from '../../model/uzenofal/types'

export interface HirdetmenyUrlapErtek {
  cim: string
  kategoria: string
  datum: string
  leiras: string
  lathatosag: HirdetmenyLathatosag
}

interface HirdetmenyFormProps {
  kezdoErtek: HirdetmenyUrlapErtek
  szerkesztes: boolean
  onMentes: (ertek: HirdetmenyUrlapErtek) => void
  onMegse: () => void
}

const inputOsztaly =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

const labelOsztaly = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'

export function HirdetmenyForm({
  kezdoErtek,
  szerkesztes,
  onMentes,
  onMegse,
}: HirdetmenyFormProps) {
  const form = useForm({
    defaultValues: kezdoErtek,
    onSubmit: async ({ value }) => {
      onMentes(value)
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      noValidate
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {szerkesztes ? 'Hirdetmény módosítása' : 'Új hirdetmény'}
      </h2>

      <form.Field
        name="cim"
        validators={{
          onChange: ({ value }) =>
            value.trim() === '' ? 'Add meg a hirdetmény címét.' : undefined,
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className={labelOsztaly}>
              Cím
            </label>
            <input
              id={field.name}
              name={field.name}
              type="text"
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <form.Field
          name="kategoria"
          validators={{
            onChange: ({ value }) => (value === '' ? 'Válassz kategóriát.' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className={labelOsztaly}>
                Kategória
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                className={inputOsztaly}
              >
                <option value="">Válassz kategóriát…</option>
                {HIRDETMENY_KATEGORIAK.map((kategoria) => (
                  <option key={kategoria} value={kategoria}>
                    {kategoria}
                  </option>
                ))}
              </select>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
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
      </div>

      <form.Field name="lathatosag">
        {(field) => (
          <div>
            <span className={labelOsztaly}>Láthatóság</span>
            <div className="grid grid-cols-2 gap-2 sm:max-w-xs">
              {(
                [
                  { ertek: 'nyilvanos', cimke: 'Nyilvános' },
                  { ertek: 'rejtett', cimke: 'Rejtett' },
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
        name="leiras"
        validators={{
          onChange: ({ value }) => (value.trim() === '' ? 'Add meg a leírást.' : undefined),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className={labelOsztaly}>
              Részletes leírás
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={5}
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
              {isSubmitting ? 'Mentés…' : szerkesztes ? 'Mentés' : 'Rögzítés'}
            </button>
          )}
        </form.Subscribe>
        <button
          type="button"
          onClick={onMegse}
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Mégse
        </button>
      </div>
    </form>
  )
}
