# THPortal – Társasházi portál

Társasházkezelő webalkalmazás: albetétek és lakók nyilvántartása, folyószámla
(előírások és befizetések) kezelése, valamint üzenőfal hirdetményekkel.
Szerepkör-alapú hozzáféréssel (közös képviselő / lakó).

## Funkciók

- **Albetét lista** – az albetétek adatai, lakók, számított egyenleg.
- **Folyószámla** – albetétenkénti tételes kimutatás (előírás/befizetés,
  görgetett egyenleg).
- **Befizetések** – előírás vagy befizetés rögzítése; az egyenleg és a
  folyószámla azonnal frissül.
- **Üzenőfal** – hirdetmények kategóriával, dátummal, láthatósággal
  (nyilvános/rejtett); szűrés, létrehozás, módosítás, törlés.
- **Bejelentkezés + szerepkörök** – közös képviselő (teljes hozzáférés) és
  lakó (csak a saját folyószámla + a nyilvános hirdetmények, szerkesztés nélkül).
- Sötét/világos téma.

## Technológiák

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router,
  TanStack Form.
- **Backend:** Node.js, Express, SQLite (better-sqlite3).

## Előfeltételek

- **Node.js 20.19+** (ajánlott: 22 LTS) és npm.
- A `better-sqlite3` natív modul telepítéséhez általában előre lefordított
  csomag töltődik le; ha a gépeden fordítani kellene, szükség lehet build
  eszközökre (Windows: „Desktop development with C++" a Visual Studio Build
  Toolsból; macOS: Xcode Command Line Tools; Linux: `build-essential`, `python3`).

## Könyvtárszerkezet

```
thportal/
├─ backend/     Node.js + Express + SQLite API és a frontend kiszolgálása
└─ frontend/
   └─ thportal/ React + Vite alkalmazás
```

## Beüzemelés

### 1. Függőségek telepítése

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend/thportal
npm install
```

### 2. Indítás – két lehetőség

#### A) Egy porton (production-szerű) – a backend szolgálja ki a frontendet

```bash
# 1) A frontend buildelése
cd frontend/thportal
npm run build

# 2) A backend indítása (kiszolgálja a buildet + az API-t)
cd ../../backend
npm start
```

Az alkalmazás ezután itt érhető el: **http://localhost:3000**

#### B) Fejlesztői mód (hot reload) – két folyamat

```bash
# 1. terminál – backend (API a 3000-es porton)
cd backend
npm start           # vagy: npm run dev  (fájlfigyeléssel)

# 2. terminál – frontend dev szerver
cd frontend/thportal
npm run dev
```

A frontend ekkor a Vite által kiírt címen érhető el (általában
**http://localhost:5173**), és az `/api` kéréseket automatikusan a backendhez
továbbítja (proxy a `vite.config.ts`-ben).

A port a backendnél a `PORT` környezeti változóval módosítható, pl.
`PORT=4000 npm start`.

## Bejelentkezés (teszt felhasználók)

A jelszó minden esetben: **`admin`**

| E-mail                       | Szerep            | Mit lát                                              |
| ---------------------------- | ----------------- | ---------------------------------------------------- |
| `admin@admin.com`            | Közös képviselő   | Minden funkció (albetétek, befizetések, üzenőfal)    |
| bármelyik lakó e-mail címe   | Lakó              | Csak a saját folyószámlája + nyilvános üzenőfal      |

Lakói e-mail címek például: `kovacs.janos@example.com`, `nagy.eva@example.com`,
`szabo.maria@example.com`. A teljes lista az adatbázisból lekérdezhető
(lásd lentebb a `npm run db:show` parancsot, `lakok` tábla).

## Adatbázis

- SQLite fájl: `backend/data/thportal.db` – **az első indításkor automatikusan
  létrejön és feltöltődik mintaadatokkal** (nincs külön migráció/seed lépés).
- A tartalom megtekintése:

  ```bash
  cd backend
  npm run db:show
  ```

- Alaphelyzetbe állítás (friss mintaadatok): állítsd le a backendet, töröld a
  `backend/data/thportal.db` (és `-wal`, `-shm`) fájlokat, majd indítsd újra.

## REST API

Alap útvonal: `/api` (pl. `http://localhost:3000/api/hirdetmenyek`).
A végpontok részletes listája a [backend/README.md](backend/README.md) fájlban.
A `GET` végpontok böngészőből közvetlenül is megnyithatók.

## Megjegyzés a biztonságról

Ez egy demó/teszt alkalmazás. A hitelesítés egyszerűsített: a jelszó fixen
`admin`, és a REST végpontok nincsenek szerveroldalon jogosultsághoz kötve – a
szerepkör-korlátozás a felületen érvényesül. Éles használathoz valódi
jelszókezelés (hash) és szerveroldali hozzáférés-ellenőrzés (pl. session/JWT)
szükséges.
