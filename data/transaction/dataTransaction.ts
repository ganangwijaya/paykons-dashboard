import { useMemo } from "react";
import { DataState } from "../../utils/interface";

export const TransactionData: DataState[] = [
  {
    id: 1,
    name: 'Bayar Kontrakan Bulanan',
    transactionDate: new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }).format(new Date('2022-01-03T13:00:00.000Z')),
    amount: 1700000,
    pic: 'John',
    status: 'confirmed',
  },
  {
    id: 2,
    name: 'Bayar Listrik',
    transactionDate: new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }).format(new Date('2022-01-05T14:00:00.000Z')),
    amount: 500000,
    pic: 'Cena',
    status: 'unconfirmed',
  },
  {
    id: 3,
    name: 'Bayar Internet',
    transactionDate: new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }).format(new Date('2022-01-09T22:00:00.000Z')),
    amount: 450000,
    pic: 'John',
    status: 'confirmed',
  },
  {
    id: 4,
    name: 'Keamanan',
    transactionDate: new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }).format(new Date('2022-01-09T22:00:00.000Z')),
    amount: 50000,
    pic: 'John',
    status: 'confirmed',
  },
  {
    id: 5,
    name: 'Sampah',
    transactionDate: new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }).format(new Date('2022-01-09T22:00:00.000Z')),
    amount: 50000,
    pic: 'John',
    status: 'confirmed',
  }
]