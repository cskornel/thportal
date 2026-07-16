// Kilistázza az adatbázis tábláit és azok tartalmát a konzolra.
// Futtatás: npm run db:show
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbFile = path.join(__dirname, '..', 'data', 'thportal.db')

if (!existsSync(dbFile)) {
  console.error('Az adatbázis még nem létezik. Indítsd el egyszer a backendet: npm start')
  process.exit(1)
}

const db = new Database(dbFile, { readonly: true })

const tablak = db
  .prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  )
  .all()

for (const { name } of tablak) {
  const sorok = db.prepare(`SELECT * FROM "${name}"`).all()
  console.log(`\n=== ${name} (${sorok.length} sor) ===`)
  console.table(sorok)
}

db.close()
