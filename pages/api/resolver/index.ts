import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
const bcrypt = require('bcryptjs');

const DateNow = new Date();

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

      if (user == null || user.length == 0) {
        return ({ status: { success: false, message: 'User not found.' } })
      }
      else {
        if (bcrypt.compareSync(password, user[0].password)) {
          return ({
            status: { success: true, message: 'Login success.' },
            member: { ...member[0] }
          })
        }
        else {
          return ({ status: { success: false, message: 'Incorrect password.' } })
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

          return ({ success: true, message: 'Member submitted.' })
        } catch (error) {
          return ({ success: false, message: error })
        }
      } else {
        return ({ success: false, message: 'User email already used.' })
      }
    },
    editMember: async (_: any, { name, email, classData, phone, bio }: { name: string, email: string, classData: number, phone: string, bio: string, }) => {
      let { db } = await connectToDatabase();

      const member = await db.collection("member").findOne({ email: email })

      if (member != null) {
        try {
          db.collection("member").updateOne({ email: email }, { $set: { name: name, class: classData, phone: phone, bio: bio, _lastUpdate: DateNow.toISOString() } })
          return ({ success: true, message: 'Profile has been successfully updated.' })
        } catch (error) {
          return ({ success: false, message: error })
        }
      } else {
        return ({ success: false, message: 'User not found.' })
      }
    },
    changePassword: async (_: any, { email, oldPassword, newPassword }: { email: string, oldPassword: string, newPassword: string }) => {
      let { db } = await connectToDatabase();

      const user = await db.collection("user").findOne({ email: email })
      if (user != null) {
        try {
          if (bcrypt.compareSync(oldPassword, user.password)) {
            const hashedpass = bcrypt.hashSync(newPassword, 10);
            db.collection("user").updateOne({ email: email }, { $set: { password: hashedpass } });
            return ({ success: true, message: 'Password has been successfully changed.' })
          } else {
            return ({ success: false, message: 'Your old password did not match.' })
          }
        } catch (error) {
          return ({ success: false, message: error })
        }
      } else {
        return ({ success: false, message: 'User not found.' })
      }
    }
  }
}