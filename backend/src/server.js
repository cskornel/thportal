import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { api } from './api.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000

// A frontend production buildje (npm run build a frontend/thportal mappában).
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'thportal', 'dist')

const app = express()
app.use(express.json())

// REST API
app.use('/api', api)

// Statikus frontend kiszolgálása
app.use(express.static(frontendDist))

// SPA fallback: minden nem-API GET kérés az index.html-t kapja,
// hogy a kliensoldali útvonalak (react-router) mély linkjei is működjenek.
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    return next()
  }
  const indexHtml = path.join(frontendDist, 'index.html')
  if (existsSync(indexHtml)) {
    return res.sendFile(indexHtml)
  }
  res
    .status(503)
    .send('A frontend build hiányzik. Futtasd: cd ../frontend/thportal && npm run build')
})

app.listen(PORT, () => {
  console.log(`THPortal backend fut: http://localhost:${PORT}`)
  if (!existsSync(frontendDist)) {
    console.warn(
      `Figyelem: a frontend build nem található (${frontendDist}). ` +
        'Előbb futtasd a frontend "npm run build" parancsát.',
    )
  }
})
