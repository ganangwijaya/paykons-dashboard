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

  type Query {
    member: [Member]!
    getMember(_id: String!): [Member]!
    getAuth(email: String!, password: String!): AuthPayload!
  }

  type Message {
    success: Boolean
    message: String
  }

  type Mutation {
    addMember(name: String, email: String, password: String, classData: Int, phone: String, bio: String, role: Int, _lastUpdate: String): Message
  }
  `