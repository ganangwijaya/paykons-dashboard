import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
const bcrypt = require('bcryptjs');

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
    },
    getAuth: async (_: any, { email, password }: { email: string, password: string }) => {
      let { db } = await connectToDatabase();

      const user = await db.collection("user").find({ email: email }).toArray();
      const member = await db.collection("member").find({ email: email }).toArray();

      if (user == null) {
        return ({ status: { success: false, message: 'User not found' } })
      }
      else {
        if (bcrypt.compareSync(password, user[0].password)) {
          return ({
            status: { success: true, message: 'berhasil' },
            member: { ...member[0] }
          })
        }
        else {
          return ({ status: { success: false, message: 'Incorect password' } })
        }
      }
    }
  },
  Mutation: {
    addMember: async (_: any, { name, email, password, classData, phone, bio, role, _lastUpdate }: { name: string, email: string, password: string, classData: number, phone: string, bio: string, role: number, _lastUpdate: string }) => {
      let { db } = await connectToDatabase();

      const member = await db.collection("member").findOne({ email: email })

      if (member == null) {
        try {
          const hashedpass = bcrypt.hashSync(password, 10);

          await db.collection("user").insertOne({ email: email, password: hashedpass, _lastUpdate: _lastUpdate, _createdAt: _lastUpdate });
          await db.collection("member").insertOne({ name: name, email: email, class: classData, phone: phone, bio: bio, role: role, _lastUpdate: _lastUpdate, _createdAt: _lastUpdate });

          return ({ success: true, message: 'Berhasil tambah data' })
        } catch (error) {
          return ({ success: false, message: error })
        }
      } else {
        return ({ success: false, message: 'Gagal, email sudah digunakan' })
      }


    }
  }
}