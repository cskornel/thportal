export type MenupontId = 'albetetek' | 'befizetesek' | 'uzenofal'

export interface Menupont {
  id: MenupontId
  cimke: string
  utvonal: string
}
