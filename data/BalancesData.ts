import axios from "axios";
import { useEffect, useState } from "react";
import { BalanceState, PayoutState, TransactionState } from "../utils/interface";

const GetData = async () => {
  const queryPayout = `query Payouts {
    payouts {
      _id
      pic
      payoutDate
      amount
      status
      evidence
      confirmedBy
      _lastUpdate
      _createdAt
      member {
        _id
        name
        email
        class
      }
    }
  }`
  const resPayout = await axios.post('/api/graphql', { query: queryPayout });
  const payoutData: PayoutState[] = resPayout.data.data.payouts;

  const query = `query Query {
    transactions {
      _id
      name
      transactionDate
      amount
      pic
      status
      confirmedBy
      evidence
      _lastUpdate
      _createdAt
    }
  }`

  const resTransaction = await axios.post('/api/graphql', { query });
  const transactionData: TransactionState[] = resTransaction.data.data.transactions;

  return [payoutData, transactionData] as const
}

export const BalancesData = () => {
  const [PayoutData, setPayoutData] = useState<PayoutState[]>([])
  const [TransactionData, setTransactionData] = useState<TransactionState[]>([])
  const [BalancesArray, setBalanceArray] = useState<BalanceState[]>([])

  useEffect(() => {
    const getData = async () => {
      const [payoutData, transactionData] = await GetData();
      setPayoutData(payoutData);
      setTransactionData(transactionData);
    }

    getData()

    return () => { }
  }, [])

  useEffect(() => {
    var UniqueMonth: Set<string> = new Set([...TransactionData.map(d => d.transactionDate.split('-')[0] + '-' + d.transactionDate.split('-')[1]), ...PayoutData.map(d => d.payoutDate.split('-')[0] + '-' + d.payoutDate.split('-')[1])]);
    
    setBalanceArray(a => (
      Array.from(UniqueMonth).map((i, x) => {
        var income: number = 0;
        var outcome: number = 0;

        TransactionData.filter(f => f.transactionDate.includes(i)).map(a => {
          outcome = outcome + a.amount;
        })

        PayoutData.filter(f => f.payoutDate.includes(i)).map(a => {
          income = income + a.amount;
        })

        return (
          { id: x, month: i, income: income, outcome: outcome, balance: income - outcome }
        )
      })
    ))

    return () => { }
  }, [TransactionData, PayoutData])

  return [BalancesArray];
}