import axios from "axios";
import { PayoutState } from "./interface";

export const EditPayout = async (data: PayoutState) => {
  const queryEdit = `mutation Mutation {
    editPayout(
      _id: "${data._id}"
      pic: "${data.pic}"
      payoutDate: "${data.payoutDate}"
      amount: ${data.amount}
      evidence: "${data.evidence}"
      status: "${data.status}"
    ) {
      success
      message
    }
  }`

  const mutation = await axios.post('/api/graphql', { query: queryEdit });
  const result = mutation.data.data.editPayout;

  return result
}

export const ConfirmPayout = async (data: PayoutState) => {
  const queryConfirm = `mutation Mutation {
    editPayout(
      _id: "${data._id}"
      amount: null
      status: "confirmed"
      pic: "${data.pic}"
    ) {
      success
      message
    }
  }`

  const mutation = await axios.post('/api/graphql', { query: queryConfirm });
  const result = mutation.data.data.editPayout;
  
  return result
}

export const DeletePayout = async (data: PayoutState) => {
  const queryDelete = `mutation Mutation {
    deletePayout(
      _id: "${data._id}"
    ) {
      success
      message
    }
  }`

  const mutation = await axios.post('/api/graphql', { query: queryDelete });
  const result = mutation.data.data.deletePayout;

  return result
}