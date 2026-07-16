import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AdatProvider } from './context/AdatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdatProvider>
        <App />
      </AdatProvider>
    </BrowserRouter>
  </StrictMode>,
)
