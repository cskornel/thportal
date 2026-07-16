import { Navigate, Route, Routes } from 'react-router-dom'
import { AlbetetekLista } from './components/albetetek/AlbetetekLista'
import { EgyenlegOldal } from './components/albetetek/EgyenlegOldal'
import { MainLayout } from './components/layout/MainLayout'
import { Uzenofal } from './components/uzenofal/Uzenofal'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/albetetek" replace />} />
        <Route path="albetetek" element={<AlbetetekLista />} />
        <Route path="albetetek/:albetetId/egyenleg" element={<EgyenlegOldal />} />
        <Route path="uzenofal" element={<Uzenofal />} />
        <Route path="*" element={<Navigate to="/albetetek" replace />} />
      </Route>
    </Routes>
  )
}

export default App
