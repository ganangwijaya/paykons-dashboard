import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Member {
    _id: String
    name: String
    email: String
    class: Int
    phone: String
    bio: String
    role: Int
    _lastUpdate: String
  }

  type User {
    _id: String
    email: String
    password: String
    _lastUpdate: String
    _createdAt: String
  }

  type AuthPayload { 
    status: Message!
    member: Member
  }

  type Message {
    success: Boolean
    message: String
  }

  type Transaction {
    _id: String
    name: String
    transactionDate: String
    amount: Int
    pic: String
    evidence: String
    status: String
    confirmedBy: String
    _lastUpdate: String
    _createdAt: String
  }

  type Query {
    member: [Member]!
    getMember(_id: String!, email: String!): Member
    getAuth(email: String!, password: String!): AuthPayload!
    transactions: [Transaction]!
  }

  type Mutation {
    addMember(name: String!, email: String!, password: String!, classData: Int!, phone: String!, bio: String!, role: Int, _lastUpdate: String!): Message!
    editMember(name: String!, email: String!, classData: Int!, phone: String!, bio: String!): Message!
    changePassword(email: String!, oldPassword: String!, newPassword: String!): Message!

    addTransaction(name: String!, transactionDate: String!, amount: Int!, pic: String!, evidence: String!, status: String!): Message!
    editTransaction(_id: String!, name: String, transactionDate: String, amount: Int, pic: String, evidence: String, status: String): Message!
    deleteTransaction(_id: String!): Message!
  }
  `