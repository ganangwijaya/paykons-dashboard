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
  bio: string,
  role: number,
  _id: string,
  _lastUpdate: string,
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

export interface PermissionState {
  id: number,
  name: string,
  status: boolean,
  lastUpdate: string,
}

export interface RoleState {
  id: number,
  name: string,
  permission: PermissionState[],
  lastUpdate: string,
}

export interface BalanceState {
  id: number,
  month: string,
  income: number,
  outcome: number,
  balance: number
}