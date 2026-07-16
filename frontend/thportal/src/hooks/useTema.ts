import { useEffect, useState } from 'react'

export type Tema = 'light' | 'dark'

export const TEMA_TAROLASI_KULCS = 'thportal-tema'

function kezdetiTema(): Tema {
  const meglevo = document.documentElement.getAttribute('data-theme')
  if (meglevo === 'light' || meglevo === 'dark') return meglevo

  const mentett = localStorage.getItem(TEMA_TAROLASI_KULCS)
  if (mentett === 'light' || mentett === 'dark') return mentett

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(kezdetiTema)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem(TEMA_TAROLASI_KULCS, tema)
  }, [tema])

  function valt() {
    setTema((elozo) => (elozo === 'dark' ? 'light' : 'dark'))
  }

  return { tema, valt }
}
