import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMunkamenet } from '../../context/MunkamenetContext'

const inputOsztaly =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

const labelOsztaly = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'

const EMAIL_MINTA = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Bejelentkezes() {
  const { bejelentkezes } = useMunkamenet()
  const navigate = useNavigate()
  const [hiba, setHiba] = useState('')

  const form = useForm({
    defaultValues: { email: '', jelszo: '' },
    onSubmit: async ({ value }) => {
      setHiba('')
      try {
        const munkamenet = await bejelentkezes(value.email.trim(), value.jelszo)
        // Közös képviselő mindig az albetét listára, lakó a saját folyószámlájára érkezik.
        const kezdoUt =
          munkamenet.szerep === 'kepviselo'
            ? '/albetetek'
            : `/albetetek/${munkamenet.albetetId}/egyenleg`
        navigate(kezdoUt, { replace: true })
      } catch (error) {
        setHiba(error instanceof Error ? error.message : 'A bejelentkezés sikertelen.')
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">THPortal</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Jelentkezz be a folytatáshoz.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
          noValidate
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {hiba && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {hiba}
            </p>
          )}

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (value.trim() === '') return 'Add meg az e-mail-címet.'
                if (!EMAIL_MINTA.test(value.trim())) return 'Érvénytelen e-mail-cím.'
                return undefined
              },
            }}
          >
            {(field) => (
              <div>
                <label htmlFor={field.name} className={labelOsztaly}>
                  E-mail cím
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="username"
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
            name="jelszo"
            validators={{
              onChange: ({ value }) => (value === '' ? 'Add meg a jelszót.' : undefined),
            }}
          >
            {(field) => (
              <div>
                <label htmlFor={field.name} className={labelOsztaly}>
                  Jelszó
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="current-password"
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

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Bejelentkezés…' : 'Bejelentkezés'}
              </button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  )
}
