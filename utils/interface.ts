export interface DataState {
  id: number,
  name: string,
  transactionDate: string,
  amount: number,
  pic: string,
  status: 'confirmed' | 'unconfirmed',
}