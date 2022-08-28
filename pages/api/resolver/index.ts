import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";

export const resolvers = {
  Query: {
    member: async () => {
      let { db } = await connectToDatabase();
      const member = await db.collection("member").find().toArray();
      return [...member]
    },
    getMember: async (_: any, { _id }: { _id: string }) => {
      let { db } = await connectToDatabase();
      const member = await db.collection("member").find({ _id: new ObjectId(_id) }).toArray();
      return member
    }
  },
  Mutation: {
    addMember: async (_: any, { name, classData, phone, bio, role, _lastUpdate }: { name: string, classData: number, phone: string, bio: string, role: number, _lastUpdate: string }) => {
      let { db } = await connectToDatabase();

      try {
        await db.collection("member").insertOne({ name: name, class: classData, phone: phone, bio: bio, role: role, _lastUpdate: _lastUpdate });
        return ({ success: true, message: 'berhasil tambah data' })
      } catch (error) {
        return ({ success: false, message: error })
      }
    }
  }
}