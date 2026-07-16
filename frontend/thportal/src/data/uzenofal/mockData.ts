import type { Hirdetmeny } from '../../model/uzenofal/types'

export const kezdetiHirdetmenyek: Hirdetmeny[] = [
  {
    id: 'h-1',
    cim: 'Rendes közgyűlés meghívó',
    kategoria: 'Közgyűlés',
    datum: '2026-07-01',
    leiras:
      'A társasház rendes éves közgyűlését 2026. július 24-én 18:00 órakor tartjuk a földszinti közösségi helyiségben. Napirend: éves beszámoló, felújítási terv, közös költség felülvizsgálata.',
    rogzitoNev: 'Medve Lászlóné',
    rogzitoSzerepkor: 'Közös képviselő',
    lathatosag: 'nyilvanos',
  },
  {
    id: 'h-2',
    cim: 'Lépcsőházi festés',
    kategoria: 'Karbantartás',
    datum: '2026-06-10',
    leiras:
      'A B lépcsőház festése 2026. június 20-tól kezdődik, várhatóan egy hétig tart. Kérjük, ez idő alatt a folyosón tárolt tárgyakat szíveskedjenek elpakolni.',
    rogzitoNev: 'Nagy Sándor',
    rogzitoSzerepkor: 'Gondnok',
    lathatosag: 'nyilvanos',
  },
  {
    id: 'h-3',
    cim: 'Takarítási rend változása',
    kategoria: 'Általános',
    datum: '2026-05-28',
    leiras:
      'A lépcsőházi takarítás rendje megváltozik: a nagytakarítás mostantól kéthetente, páros heteken, szerdán történik. Kérjük, ezeken a napokon a lábtörlőket szíveskedjenek beljebb helyezni.',
    rogzitoNev: 'Kiss Judit',
    rogzitoSzerepkor: 'Takarító',
    lathatosag: 'rejtett',
  },
]
