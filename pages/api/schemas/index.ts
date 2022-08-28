import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Member {
    _id: String
    name: String
    class: Int
    phone: String
    bio: String
    role: Int
    _lastUpdate: String
  }

  type Query {
    member: [Member]!
    getMember(_id: String!): [Member]!
  }

  type Message {
    success: Boolean
    message: String
  }

  type Mutation {
    addMember(name: String, classData: Int, phone: String, bio: String, role: Int, _lastUpdate: String): Message
  }
  `