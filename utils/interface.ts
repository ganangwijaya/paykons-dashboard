export interface DataState {
  id: number,
  name: string,
  transactionDate: string,
  lastUpdate: string,
  amount: number,
  pic: string,
  status: 'confirmed' | 'unconfirmed',
}

export interface MemberState {
  id: number,
  name: string,
  email: string,
  class: number,
  phone: string,
  lastUpdate: string,
}