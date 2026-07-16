import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'
import { alapAdatok } from './seed-data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

const db = new Database(path.join(dataDir, 'thportal.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS beallitasok (
    kulcs TEXT PRIMARY KEY,
    ertek TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS albetetek (
    id INTEGER PRIMARY KEY,
    lepcsohaz TEXT NOT NULL,
    emelet INTEGER NOT NULL,
    ajto TEXT NOT NULL,
    albetetszam INTEGER NOT NULL,
    helyrajziSzam TEXT NOT NULL,
    terulet INTEGER NOT NULL,
    szoba INTEGER NOT NULL,
    felszoba INTEGER NOT NULL,
    tulajdoniJogviszony TEXT NOT NULL,
    tulajdoniHanyad TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lakok (
    id INTEGER PRIMARY KEY,
    albetetId INTEGER NOT NULL REFERENCES albetetek(id),
    nev TEXT NOT NULL,
    jogviszonyok TEXT NOT NULL,
    tulajdonosiHanyad INTEGER,
    jogviszonyKezdete TEXT NOT NULL,
    emailCim TEXT NOT NULL,
    mobilszam TEXT NOT NULL,
    dijfizeto INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS egyenleg_tetelek (
    id TEXT PRIMARY KEY,
    albetetId INTEGER NOT NULL REFERENCES albetetek(id),
    tipus TEXT NOT NULL CHECK (tipus IN ('eloiras', 'befizetes')),
    datum TEXT NOT NULL,
    osszeg INTEGER NOT NULL,
    megjegyzes TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_tetelek_albetet ON egyenleg_tetelek(albetetId);

  CREATE TABLE IF NOT EXISTS hirdetmenyek (
    id TEXT PRIMARY KEY,
    cim TEXT NOT NULL,
    kategoria TEXT NOT NULL,
    datum TEXT NOT NULL,
    leiras TEXT NOT NULL,
    rogzitoNev TEXT NOT NULL,
    rogzitoSzerepkor TEXT NOT NULL,
    lathatosag TEXT NOT NULL CHECK (lathatosag IN ('nyilvanos', 'rejtett'))
  );
`)

/** Első indításkor feltölti az adatbázist a mintaadatokkal. */
function seedIfEmpty() {
  const van = db.prepare('SELECT COUNT(*) AS db FROM albetetek').get()
  if (van.db > 0) return

  const beallitasBe = db.prepare(
    'INSERT INTO beallitasok (kulcs, ertek) VALUES (?, ?)',
  )
  const albetetBe = db.prepare(`
    INSERT INTO albetetek (id, lepcsohaz, emelet, ajto, albetetszam, helyrajziSzam, terulet, szoba, felszoba, tulajdoniJogviszony, tulajdoniHanyad)
    VALUES (@id, @lepcsohaz, @emelet, @ajto, @albetetszam, @helyrajziSzam, @terulet, @szoba, @felszoba, @tulajdoniJogviszony, @tulajdoniHanyad)
  `)
  const lakoBe = db.prepare(`
    INSERT INTO lakok (id, albetetId, nev, jogviszonyok, tulajdonosiHanyad, jogviszonyKezdete, emailCim, mobilszam, dijfizeto)
    VALUES (@id, @albetetId, @nev, @jogviszonyok, @tulajdonosiHanyad, @jogviszonyKezdete, @emailCim, @mobilszam, @dijfizeto)
  `)
  const tetelBe = db.prepare(`
    INSERT INTO egyenleg_tetelek (id, albetetId, tipus, datum, osszeg, megjegyzes)
    VALUES (@id, @albetetId, @tipus, @datum, @osszeg, @megjegyzes)
  `)
  const hirdetmenyBe = db.prepare(`
    INSERT INTO hirdetmenyek (id, cim, kategoria, datum, leiras, rogzitoNev, rogzitoSzerepkor, lathatosag)
    VALUES (@id, @cim, @kategoria, @datum, @leiras, @rogzitoNev, @rogzitoSzerepkor, @lathatosag)
  `)

  const feltolt = db.transaction(() => {
    beallitasBe.run('tarsashaz', JSON.stringify(alapAdatok.tarsashaz))
    beallitasBe.run('felhasznalo', JSON.stringify(alapAdatok.felhasznalo))
    beallitasBe.run('koltsegvetesiEv', JSON.stringify(alapAdatok.koltsegvetesiEv))

    for (const albetet of alapAdatok.albetetek) albetetBe.run(albetet)
    for (const lako of alapAdatok.lakok) {
      lakoBe.run({
        ...lako,
        jogviszonyok: JSON.stringify(lako.jogviszonyok),
        dijfizeto: lako.dijfizeto ? 1 : 0,
      })
    }
    for (const tetel of alapAdatok.egyenlegTetelek) {
      tetelBe.run({ ...tetel, megjegyzes: tetel.megjegyzes ?? null })
    }
    for (const hirdetmeny of alapAdatok.hirdetmenyek) hirdetmenyBe.run(hirdetmeny)
  })

  feltolt()
  console.log('Adatbázis feltöltve a mintaadatokkal.')
}

seedIfEmpty()

export default db
