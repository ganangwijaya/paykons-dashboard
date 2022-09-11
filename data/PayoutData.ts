import axios from "axios";
import { useEffect, useState } from "react";
import { MemberPayoutState } from "../utils/interface";

const GetData = async () => {
  const queryMemberPayout = `query Query {
    getMemberPayouts {
      notPaid {
        email
      }
      paid {
        email
        confirmedPayout
        unconfirmedPayout
      }
    }
  }`

  const resPayout = await axios.post('/api/graphql', { query: queryMemberPayout });
  const data: MemberPayoutState = resPayout.data.data.getMemberPayouts;

  return [data] as const
}

export const PayoutMemberData = () => {
  const [PayoutMemberData, setPayoutMemberData] = useState<MemberPayoutState>();

  useEffect(() => {
    const getData = async () => {
      const [payoutData] = await GetData();
      setPayoutMemberData(payoutData);
    }
    getData()
    return () => { }
  }, [])

  return PayoutMemberData
}