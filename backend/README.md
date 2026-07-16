# THPortal backend

Node.js + Express backend, amely SQLite (better-sqlite3) adatbázist használ, és
kiszolgálja a frontend production buildjét.

## Telepítés

```bash
cd backend
npm install
```

## Indítás

Előbb build-eld a frontendet (a backend a `frontend/thportal/dist` mappát szolgálja ki):

```bash
cd ../frontend/thportal
npm run build
```

Majd indítsd a backendet:

```bash
cd ../../backend
npm start        # vagy: npm run dev  (fájlfigyeléssel)
```

Az alkalmazás ezután elérhető: http://localhost:3000

A port a `PORT` környezeti változóval módosítható.

## Adatbázis

- SQLite fájl: `data/thportal.db` (első indításkor automatikusan létrejön és
  feltöltődik a mintaadatokkal – lásd `src/seed-data.js`).
- Séma és seedelés: `src/db.js`.

## REST API (`/api`)

| Metódus | Útvonal                          | Leírás                                    |
| ------- | -------------------------------- | ----------------------------------------- |
| GET     | `/api/tarsashaz`                 | Társasház adatai                          |
| GET     | `/api/felhasznalo`               | Bejelentkezett felhasználó                |
| GET     | `/api/koltsegvetesi-ev`          | Aktuális költségvetési év                 |
| GET     | `/api/albetetek`                 | Albetétek (számított egyenleggel)         |
| GET     | `/api/albetetek/:id`             | Egy albetét (számított egyenleggel)       |
| GET     | `/api/albetetek/:id/tetelek`     | Albetét folyószámla-tételei               |
| GET     | `/api/lakok`                     | Lakók                                     |
| POST    | `/api/tetelek`                   | Új előírás/befizetés rögzítése            |
| GET     | `/api/hirdetmenyek`              | Hirdetmények                              |
| POST    | `/api/hirdetmenyek`              | Új hirdetmény                             |
| PUT     | `/api/hirdetmenyek/:id`          | Hirdetmény módosítása                     |
| DELETE  | `/api/hirdetmenyek/:id`          | Hirdetmény törlése                        |
