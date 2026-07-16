import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Bejelentkezes } from './components/auth/Bejelentkezes.tsx'
import { AdatProvider } from './context/AdatContext.tsx'
import { MunkamenetProvider, useMunkamenet } from './context/MunkamenetContext.tsx'

function Gyoker() {
  const { munkamenet } = useMunkamenet()

  if (!munkamenet) {
    return <Bejelentkezes />
  }

  return (
    <AdatProvider>
      <App />
    </AdatProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MunkamenetProvider>
        <Gyoker />
      </MunkamenetProvider>
    </BrowserRouter>
  </StrictMode>,
)
