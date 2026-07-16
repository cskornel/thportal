import { Navigate, Route, Routes } from 'react-router-dom'
import { AlbetetekLista } from './components/albetetek/AlbetetekLista'
import { EgyenlegOldal } from './components/albetetek/EgyenlegOldal'
import { BefizetesekOldal } from './components/befizetesek/BefizetesekOldal'
import { MainLayout } from './components/layout/MainLayout'
import { Uzenofal } from './components/uzenofal/Uzenofal'
import { useMunkamenet } from './context/MunkamenetContext'

function App() {
  const { munkamenet } = useMunkamenet()

  if (!munkamenet) {
    return null
  }

  // Közös képviselő: teljes hozzáférés minden funkcióhoz.
  if (munkamenet.szerep === 'kepviselo') {
    return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/albetetek" replace />} />
          <Route path="albetetek" element={<AlbetetekLista />} />
          <Route path="albetetek/:albetetId/egyenleg" element={<EgyenlegOldal />} />
          <Route path="befizetesek" element={<BefizetesekOldal />} />
          <Route path="uzenofal" element={<Uzenofal />} />
          <Route path="*" element={<Navigate to="/albetetek" replace />} />
        </Route>
      </Routes>
    )
  }

  // Lakó: csak a saját folyószámla és a csak-olvasható üzenőfal.
  const folyoszamlaUt = `/albetetek/${munkamenet.albetetId}/egyenleg`

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={folyoszamlaUt} replace />} />
        <Route path="albetetek/:albetetId/egyenleg" element={<EgyenlegOldal />} />
        <Route path="uzenofal" element={<Uzenofal csakOlvasas />} />
        <Route path="*" element={<Navigate to={folyoszamlaUt} replace />} />
      </Route>
    </Routes>
  )
}

export default App
