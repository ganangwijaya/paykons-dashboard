export interface DataState {
  id: number,
  name: string,
  transactionDate: string,
  lastUpdate: string,
  amount: number,
  pic: string,
  status: 'confirmed' | 'unconfirmed',
}