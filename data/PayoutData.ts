import { PayoutState } from "../utils/interface";
import { MemberData } from "./MemberData";

export const PayoutData: PayoutState[] = [
  {
    id: 1,
    memberID: 1,
    payoutDate: '2022-01-03',
    amount: 100000,
    status: 'unconfirmed',
    confirmedBy: undefined,
    payoutEvidence: 'https://picsum.photos/960/540',
    lastUpdate: '2022-01-03T13:00:00.000Z',
  },
  {
    id: 2,
    memberID: 2,
    payoutDate: '2022-02-03',
    amount: 100000,
    status: 'confirmed',
    confirmedBy: 1,
    payoutEvidence: 'https://picsum.photos/960/540',
    lastUpdate: '2022-02-03T13:00:00.000Z',
  },
  {
    id: 3,
    memberID: 3,
    payoutDate: '2022-02-03',
    amount: 100000,
    status: 'confirmed',
    confirmedBy: 1,
    payoutEvidence: 'https://picsum.photos/960/540',
    lastUpdate: '2022-02-03T13:00:00.000Z',
  }
]