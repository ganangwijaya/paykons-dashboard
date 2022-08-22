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

export interface PayoutState {
  id: number,
  memberID: number,
  payoutDate: string,
  amount: number,
  status: 'confirmed' | 'unconfirmed',
  confirmedBy: undefined | number,
  payoutEvidence: string,
  lastUpdate: string,
}