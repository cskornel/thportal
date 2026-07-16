import type { Albetet, Lako } from '../../model/albetetek/types'

export const albetetek: Albetet[] = [
  { id: 1, lepcsohaz: 'A', emelet: 0, ajto: '1', albetetszam: 1, helyrajziSzam: '3241/A/1', terulet: 54, szoba: 2, felszoba: 0, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '736/10000', egyenleg: 0 },
  { id: 2, lepcsohaz: 'A', emelet: 0, ajto: '2', albetetszam: 2, helyrajziSzam: '3241/A/2', terulet: 48, szoba: 1, felszoba: 1, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '654/10000', egyenleg: -45200 },
  { id: 3, lepcsohaz: 'A', emelet: 1, ajto: '3', albetetszam: 3, helyrajziSzam: '3241/A/3', terulet: 62, szoba: 2, felszoba: 1, tulajdoniJogviszony: 'Önkormányzati', tulajdoniHanyad: '845/10000', egyenleg: 12800 },
  { id: 4, lepcsohaz: 'A', emelet: 1, ajto: '4', albetetszam: 4, helyrajziSzam: '3241/A/4', terulet: 71, szoba: 3, felszoba: 0, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '967/10000', egyenleg: 0 },
  { id: 5, lepcsohaz: 'A', emelet: 2, ajto: '5', albetetszam: 5, helyrajziSzam: '3241/A/5', terulet: 54, szoba: 2, felszoba: 0, tulajdoniJogviszony: 'Önkormányzati', tulajdoniHanyad: '736/10000', egyenleg: -128500 },
  { id: 6, lepcsohaz: 'B', emelet: 0, ajto: '1', albetetszam: 6, helyrajziSzam: '3241/A/6', terulet: 48, szoba: 1, felszoba: 1, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '654/10000', egyenleg: 6400 },
  { id: 7, lepcsohaz: 'B', emelet: 0, ajto: '2', albetetszam: 7, helyrajziSzam: '3241/A/7', terulet: 65, szoba: 2, felszoba: 1, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '886/10000', egyenleg: 0 },
  { id: 8, lepcsohaz: 'B', emelet: 1, ajto: '3', albetetszam: 8, helyrajziSzam: '3241/A/8', terulet: 78, szoba: 3, felszoba: 1, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '1063/10000', egyenleg: -23750 },
  { id: 9, lepcsohaz: 'B', emelet: 2, ajto: '4', albetetszam: 9, helyrajziSzam: '3241/A/9', terulet: 54, szoba: 2, felszoba: 0, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '736/10000', egyenleg: 34100 },
  { id: 10, lepcsohaz: 'C', emelet: 0, ajto: '1', albetetszam: 10, helyrajziSzam: '3241/A/10', terulet: 92, szoba: 3, felszoba: 1, tulajdoniJogviszony: 'Önkormányzati', tulajdoniHanyad: '1253/10000', egyenleg: -312000 },
  { id: 11, lepcsohaz: 'C', emelet: 1, ajto: '2', albetetszam: 11, helyrajziSzam: '3241/A/11', terulet: 48, szoba: 1, felszoba: 1, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '654/10000', egyenleg: 0 },
  { id: 12, lepcsohaz: 'C', emelet: 2, ajto: '3', albetetszam: 12, helyrajziSzam: '3241/A/12', terulet: 60, szoba: 2, felszoba: 1, tulajdoniJogviszony: 'Magántulajdon', tulajdoniHanyad: '816/10000', egyenleg: 9200 },
]

export const lakok: Lako[] = [
  { id: 101, albetetId: 1, nev: 'Kovács János', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2018-03-12', emailCim: 'kovacs.janos@example.com', mobilszam: '+36 20 111 2233', dijfizeto: true },

  { id: 102, albetetId: 2, nev: 'Nagy Éva', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2015-07-01', emailCim: 'nagy.eva@example.com', mobilszam: '+36 30 222 3344', dijfizeto: false },
  { id: 103, albetetId: 2, nev: 'Tóth Bence', jogviszonyok: ['Bérlő'], tulajdonosiHanyad: null, jogviszonyKezdete: '2023-09-01', emailCim: 'toth.bence@example.com', mobilszam: '+36 70 333 4455', dijfizeto: true },

  { id: 104, albetetId: 3, nev: 'Szabó Mária', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 50, jogviszonyKezdete: '2011-01-15', emailCim: 'szabo.maria@example.com', mobilszam: '+36 20 444 5566', dijfizeto: true },
  { id: 105, albetetId: 3, nev: 'Szabó Gábor', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 50, jogviszonyKezdete: '2011-01-15', emailCim: 'szabo.gabor@example.com', mobilszam: '+36 20 444 5567', dijfizeto: false },

  { id: 106, albetetId: 4, nev: 'Horváth Péter', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2019-05-20', emailCim: 'horvath.peter@example.com', mobilszam: '+36 30 555 6677', dijfizeto: true },

  { id: 107, albetetId: 5, nev: 'Varga Ilona', jogviszonyok: ['Haszonélvező'], tulajdonosiHanyad: null, jogviszonyKezdete: '2009-11-03', emailCim: 'varga.ilona@example.com', mobilszam: '+36 20 666 7788', dijfizeto: true },
  { id: 108, albetetId: 5, nev: 'Varga Zoltán', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2009-11-03', emailCim: 'varga.zoltan@example.com', mobilszam: '+36 20 666 7799', dijfizeto: false },

  { id: 109, albetetId: 6, nev: 'Kiss Anna', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2020-02-10', emailCim: 'kiss.anna@example.com', mobilszam: '+36 70 777 8899', dijfizeto: true },

  { id: 110, albetetId: 7, nev: 'Molnár Tamás', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2014-08-18', emailCim: 'molnar.tamas@example.com', mobilszam: '+36 30 888 9900', dijfizeto: true },
  { id: 111, albetetId: 7, nev: 'Fekete Zsófia', jogviszonyok: ['Bérlő'], tulajdonosiHanyad: null, jogviszonyKezdete: '2024-01-05', emailCim: 'fekete.zsofia@example.com', mobilszam: '+36 20 999 0011', dijfizeto: true },

  { id: 112, albetetId: 8, nev: 'Balogh Csaba', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2017-04-22', emailCim: 'balogh.csaba@example.com', mobilszam: '+36 20 101 2020', dijfizeto: true },
  { id: 113, albetetId: 8, nev: 'Balogh Réka', jogviszonyok: ['Lakó'], tulajdonosiHanyad: null, jogviszonyKezdete: '2017-04-22', emailCim: 'balogh.reka@example.com', mobilszam: '+36 20 101 2021', dijfizeto: false },
  { id: 114, albetetId: 8, nev: 'Balogh Levente', jogviszonyok: ['Lakó'], tulajdonosiHanyad: null, jogviszonyKezdete: '2019-06-01', emailCim: '', mobilszam: '', dijfizeto: false },

  { id: 115, albetetId: 9, nev: 'Papp Erzsébet', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2012-10-09', emailCim: 'papp.erzsebet@example.com', mobilszam: '+36 30 303 4040', dijfizeto: true },

  { id: 116, albetetId: 10, nev: 'Simon Dávid', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 60, jogviszonyKezdete: '2016-12-01', emailCim: 'simon.david@example.com', mobilszam: '+36 20 505 6060', dijfizeto: true },
  { id: 117, albetetId: 10, nev: 'Simon Krisztina', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 40, jogviszonyKezdete: '2016-12-01', emailCim: 'simon.krisztina@example.com', mobilszam: '+36 20 505 6061', dijfizeto: false },
  { id: 118, albetetId: 10, nev: 'Takács Bálint', jogviszonyok: ['Bérlő'], tulajdonosiHanyad: null, jogviszonyKezdete: '2025-02-15', emailCim: 'takacs.balint@example.com', mobilszam: '+36 70 707 8080', dijfizeto: true },

  { id: 119, albetetId: 11, nev: 'Juhász Márton', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2021-03-30', emailCim: 'juhasz.marton@example.com', mobilszam: '+36 30 909 1010', dijfizeto: true },

  { id: 120, albetetId: 12, nev: 'Oláh Ferenc', jogviszonyok: ['Tulajdonos'], tulajdonosiHanyad: 100, jogviszonyKezdete: '2008-09-17', emailCim: 'olah.ferenc@example.com', mobilszam: '+36 20 121 3030', dijfizeto: false },
]
