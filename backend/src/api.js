import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import db from './db.js'

export const api = Router()

// --- Segédfüggvények ---

function beallitas(kulcs) {
  const sor = db.prepare('SELECT ertek FROM beallitasok WHERE kulcs = ?').get(kulcs)
  return sor ? JSON.parse(sor.ertek) : null
}

function lakoSor(sor) {
  return {
    ...sor,
    jogviszonyok: JSON.parse(sor.jogviszonyok),
    dijfizeto: sor.dijfizeto === 1,
  }
}

const albetetekEgyenleggel = db.prepare(`
  SELECT a.*, COALESCE(SUM(CASE WHEN t.tipus = 'befizetes' THEN t.osszeg ELSE -t.osszeg END), 0) AS egyenleg
  FROM albetetek a
  LEFT JOIN egyenleg_tetelek t ON t.albetetId = a.id
  GROUP BY a.id
  ORDER BY a.id
`)

const albetetEgyenleggel = db.prepare(`
  SELECT a.*, COALESCE(SUM(CASE WHEN t.tipus = 'befizetes' THEN t.osszeg ELSE -t.osszeg END), 0) AS egyenleg
  FROM albetetek a
  LEFT JOIN egyenleg_tetelek t ON t.albetetId = a.id
  WHERE a.id = ?
  GROUP BY a.id
`)

// --- Bejelentkezés ---
// Egyszerű, demó szintű hitelesítés: a jelszó mindig "admin".
// admin@admin.com -> közös képviselő (teljes hozzáférés);
// bármely lakó e-mail címe -> lakó (korlátozott hozzáférés).
api.post('/login', (req, res) => {
  const { email, jelszo } = req.body ?? {}

  if (!email || jelszo !== 'admin') {
    return res.status(401).json({ hiba: 'Hibás e-mail-cím vagy jelszó.' })
  }

  if (email === 'admin@admin.com') {
    const fh = beallitas('felhasznalo')
    return res.json({
      szerep: 'kepviselo',
      nev: fh?.nev ?? 'Közös képviselő',
      email,
      szerepkor: fh?.szerepkor ?? 'Közös képviselő',
      albetetId: null,
    })
  }

  const lako = db.prepare('SELECT * FROM lakok WHERE emailCim = ?').get(email)
  if (lako) {
    const jogviszonyok = JSON.parse(lako.jogviszonyok)
    return res.json({
      szerep: 'lako',
      nev: lako.nev,
      email,
      szerepkor: jogviszonyok[0] ?? 'Lakó',
      albetetId: lako.albetetId,
    })
  }

  return res.status(401).json({ hiba: 'Hibás e-mail-cím vagy jelszó.' })
})

// --- Törzsadatok ---

api.get('/tarsashaz', (_req, res) => res.json(beallitas('tarsashaz')))
api.get('/felhasznalo', (_req, res) => res.json(beallitas('felhasznalo')))
api.get('/koltsegvetesi-ev', (_req, res) => res.json({ ev: beallitas('koltsegvetesiEv') }))

api.get('/lakok', (_req, res) => {
  const sorok = db.prepare('SELECT * FROM lakok ORDER BY id').all()
  res.json(sorok.map(lakoSor))
})

// --- Albetétek ---

api.get('/albetetek', (_req, res) => {
  res.json(albetetekEgyenleggel.all())
})

api.get('/albetetek/:id', (req, res) => {
  const albetet = albetetEgyenleggel.get(Number(req.params.id))
  if (!albetet) return res.status(404).json({ hiba: 'Albetét nem található.' })
  res.json(albetet)
})

api.get('/albetetek/:id/tetelek', (req, res) => {
  const sorok = db
    .prepare('SELECT * FROM egyenleg_tetelek WHERE albetetId = ? ORDER BY datum, tipus')
    .all(Number(req.params.id))
  res.json(sorok)
})

// --- Egyenleg tétel rögzítése (előírás vagy befizetés) ---

api.post('/tetelek', (req, res) => {
  const { albetetId, tipus, datum, osszeg, megjegyzes } = req.body ?? {}

  const letezoAlbetet = db.prepare('SELECT 1 FROM albetetek WHERE id = ?').get(albetetId)
  if (!letezoAlbetet) {
    return res.status(400).json({ hiba: 'Ismeretlen albetét.' })
  }
  if (tipus !== 'eloiras' && tipus !== 'befizetes') {
    return res.status(400).json({ hiba: 'A típus csak "eloiras" vagy "befizetes" lehet.' })
  }
  if (typeof datum !== 'string' || datum === '') {
    return res.status(400).json({ hiba: 'A dátum megadása kötelező.' })
  }
  if (!Number.isFinite(osszeg) || osszeg <= 0) {
    return res.status(400).json({ hiba: 'Az összegnek pozitív számnak kell lennie.' })
  }

  const tetel = {
    id: `t-${randomUUID()}`,
    albetetId,
    tipus,
    datum,
    osszeg: Math.round(osszeg),
    megjegyzes: megjegyzes?.trim() ? megjegyzes.trim() : null,
  }
  db.prepare(`
    INSERT INTO egyenleg_tetelek (id, albetetId, tipus, datum, osszeg, megjegyzes)
    VALUES (@id, @albetetId, @tipus, @datum, @osszeg, @megjegyzes)
  `).run(tetel)

  res.status(201).json(tetel)
})

// --- Hirdetmények (CRUD) ---

const HIRDETMENY_MEZOK = [
  'cim',
  'kategoria',
  'datum',
  'leiras',
  'rogzitoNev',
  'rogzitoSzerepkor',
  'lathatosag',
]

function hirdetmenyValidacio(test) {
  for (const mezo of HIRDETMENY_MEZOK) {
    if (typeof test?.[mezo] !== 'string' || test[mezo].trim() === '') {
      return `A(z) "${mezo}" mező megadása kötelező.`
    }
  }
  if (test.lathatosag !== 'nyilvanos' && test.lathatosag !== 'rejtett') {
    return 'A láthatóság csak "nyilvanos" vagy "rejtett" lehet.'
  }
  return null
}

api.get('/hirdetmenyek', (_req, res) => {
  const sorok = db.prepare('SELECT * FROM hirdetmenyek ORDER BY datum DESC').all()
  res.json(sorok)
})

api.post('/hirdetmenyek', (req, res) => {
  const hiba = hirdetmenyValidacio(req.body)
  if (hiba) return res.status(400).json({ hiba })

  const hirdetmeny = {
    id: `hird-${randomUUID()}`,
    cim: req.body.cim,
    kategoria: req.body.kategoria,
    datum: req.body.datum,
    leiras: req.body.leiras,
    rogzitoNev: req.body.rogzitoNev,
    rogzitoSzerepkor: req.body.rogzitoSzerepkor,
    lathatosag: req.body.lathatosag,
  }
  db.prepare(`
    INSERT INTO hirdetmenyek (id, cim, kategoria, datum, leiras, rogzitoNev, rogzitoSzerepkor, lathatosag)
    VALUES (@id, @cim, @kategoria, @datum, @leiras, @rogzitoNev, @rogzitoSzerepkor, @lathatosag)
  `).run(hirdetmeny)

  res.status(201).json(hirdetmeny)
})

api.put('/hirdetmenyek/:id', (req, res) => {
  const letezik = db.prepare('SELECT 1 FROM hirdetmenyek WHERE id = ?').get(req.params.id)
  if (!letezik) return res.status(404).json({ hiba: 'Hirdetmény nem található.' })

  const hiba = hirdetmenyValidacio(req.body)
  if (hiba) return res.status(400).json({ hiba })

  const hirdetmeny = {
    id: req.params.id,
    cim: req.body.cim,
    kategoria: req.body.kategoria,
    datum: req.body.datum,
    leiras: req.body.leiras,
    rogzitoNev: req.body.rogzitoNev,
    rogzitoSzerepkor: req.body.rogzitoSzerepkor,
    lathatosag: req.body.lathatosag,
  }
  db.prepare(`
    UPDATE hirdetmenyek
    SET cim = @cim, kategoria = @kategoria, datum = @datum, leiras = @leiras,
        rogzitoNev = @rogzitoNev, rogzitoSzerepkor = @rogzitoSzerepkor, lathatosag = @lathatosag
    WHERE id = @id
  `).run(hirdetmeny)

  res.json(hirdetmeny)
})

api.delete('/hirdetmenyek/:id', (req, res) => {
  const eredmeny = db.prepare('DELETE FROM hirdetmenyek WHERE id = ?').run(req.params.id)
  if (eredmeny.changes === 0) {
    return res.status(404).json({ hiba: 'Hirdetmény nem található.' })
  }
  res.status(204).end()
})
