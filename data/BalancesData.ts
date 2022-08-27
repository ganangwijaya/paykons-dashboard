import { BalanceState } from "../utils/interface";
import { PayoutData } from "./PayoutData";
import { TransactionData } from "./TransactionData";

var UniqueMonth: Set<string> = new Set([...TransactionData.map(d => d.transactionDate.split('-')[0] + '-' + d.transactionDate.split('-')[1]), ...PayoutData.map(d => d.payoutDate.split('-')[0] + '-' + d.payoutDate.split('-')[1])]);

export const BalancesData: BalanceState[] = Array.from(UniqueMonth).map((i, x) => {
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