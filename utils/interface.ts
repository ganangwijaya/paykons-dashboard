export interface DataState {
  id: number,
  name: string,
  transactionDate: string,
  lastUpdate: string,
  amount: number,
  pic: string,
  status: 'confirmed' | 'unconfirmed',
}

export interface TransactionState {
  _id: string,
  name: string,
  transactionDate: string,
  amount: number,
  pic: string,
  evidence: string,
  status: 'confirmed' | 'unconfirmed',
  confirmedBy: string,
  _lastUpdate: string,
  _createdAt: string,
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
  _createdAt: string,
}

export interface PayoutState {
  _id: string,
  pic: string,
  payoutDate: string,
  amount: number,
  status: 'confirmed' | 'unconfirmed',
  confirmedBy: undefined | number,
  evidence: string,
  member: MemberState,
  _lastUpdate: string,
  _createdAt: string,
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

interface MemberPayout {
  _id: string,
  email: string,
  confirmedPayout: number,
  unconfirmedPayout: number,
}

export interface MemberPayoutState {
  notPaid: MemberPayout[],
  paid: MemberPayout[]
}