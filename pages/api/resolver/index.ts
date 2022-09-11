import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
import { MemberState, PayoutState } from "../../../utils/interface";
const bcrypt = require('bcryptjs');

interface PaginationProps {
  limit: number,
  page: number
}

export const resolvers = {
  Query: {
    member: async () => {
      let { db } = await connectToDatabase();
      const member = await db.collection("member").find().toArray();
      return [...member]
    },
    getMember: async (_: any, args: MemberState) => {
      const { _id, email } = args;
      let { db } = await connectToDatabase();

      if (email == "") {
        const member = await db.collection("member").findOne({ _id: new ObjectId(_id) });
        return member
      }
      else {
        const member = await db.collection("member").findOne({ email: email });
        return member
      }
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
    },
    transactions: async () => {
      let { db } = await connectToDatabase();
      const transaction = await db.collection("transaction").find().toArray();
      return [...transaction]
    },
    payouts: async () => {
      let { db } = await connectToDatabase();
      const payout = await db.collection("payout").aggregate([
        {
          $lookup: {
            from: "member",
            localField: "pic",
            foreignField: "email",
            as: "member"
          }
        },
        {
          $addFields: {
            member: {
              $cond: {
                'if': {
                  $gte: [{
                    $size: '$member'
                  },
                    1
                  ]
                },
                then: '$member',
                'else': {
                  name: '$pic'
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: "$member"
          }
        }
      ]).toArray()

      return [...payout]
    },
    getPayouts: async (_: any, args: PayoutState) => {
      const { pic = null, payoutDate = null } = args;
      let { db } = await connectToDatabase();

      if (payoutDate && pic) {
        const payout = await db.collection("payout").aggregate([
          {
            $match: {
              payoutDate: new RegExp(`${payoutDate}`),
              pic: `${pic}`
            }
          },
          {
            $lookup: {
              from: "member",
              localField: "pic",
              foreignField: "email",
              as: "member"
            }
          },
          {
            $addFields: {
              member: {
                $cond: {
                  'if': {
                    $gte: [{
                      $size: '$member'
                    },
                      1
                    ]
                  },
                  then: '$member',
                  'else': {
                    name: '$pic'
                  }
                }
              }
            }
          },
          {
            $unwind: {
              path: "$member"
            }
          }
        ]).toArray()

        return [...payout]
      } else {
        const payout = await db.collection("payout").aggregate([
          {
            $match: {
              pic: `${pic}`
            }
          },
          {
            $lookup: {
              from: "member",
              localField: "pic",
              foreignField: "email",
              as: "member"
            }
          },
          {
            $addFields: {
              member: {
                $cond: {
                  'if': {
                    $gte: [{
                      $size: '$member'
                    },
                      1
                    ]
                  },
                  then: '$member',
                  'else': {
                    name: '$pic'
                  }
                }
              }
            }
          },
          {
            $unwind: {
              path: "$member"
            }
          }
        ]).toArray()

        return [...payout]
      }

    },
    getTotalPayouts: async (_: any, args: PayoutState) => {
      const { pic = null, payoutDate = null } = args;
      let { db } = await connectToDatabase();

      if (pic) {
        if (payoutDate) {
          const payout = await db.collection("payout").aggregate([
            {
              $match: {
                payoutDate: new RegExp(`${payoutDate}`),
                pic: `${pic}`
              }
            },
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: '$amount'
                }
              }
            }
          ]).toArray();
          return payout[0].totalAmount
        } else {
          const payout = await db.collection("payout").aggregate([
            {
              $match: {
                pic: `${pic}`
              }
            },
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: '$amount'
                }
              }
            }
          ]).toArray();
          return payout[0].totalAmount
        }

      } else {
        return 0
      }

    },
    pagePayouts: async (_: any, args: PaginationProps) => {
      const { limit = 1, page = 1 } = args;
      let { db } = await connectToDatabase();

      const payoutQuery = [
        {
          $lookup: {
            from: "member",
            localField: "pic",
            foreignField: "email",
            as: "member"
          }
        },
        {
          $addFields: {
            member: {
              $cond: {
                'if': {
                  $gte: [{
                    $size: '$member'
                  },
                    1
                  ]
                },
                then: '$member',
                'else': {
                  name: '$pic'
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: "$member"
          }
        },
        {
          $facet: {
            count: [{
              $count: 'count'
            }],
            total: [{
              $group: {
                _id: null,
                total: {
                  $sum: '$amount'
                }
              }
            }],
            result: [{
              $skip: page > 0 ? (page - 1) * limit : 0
            },
            {
              $limit: limit
            }
            ]
          }
        },
        {
          $unwind: {
            path: '$count'
          }
        },
        {
          $unwind: {
            path: '$total'
          }
        },
        {
          $project: {
            count: '$count.count',
            totalPayout: '$total.total',
            result: true
          }
        }
      ]

      const [payout] = await db.collection("payout").aggregate(payoutQuery).toArray()
      const { result, count, totalPayout } = payout

      return {
        count: count,
        prev: (limit * page) > count ? 0 : (limit * page) - limit,
        next: (limit * page) > count ? 0 : count - (limit * page),
        currentPage: page,
        totalPages: count < limit ? 1 : Math.round(count / limit),
        totalPayout: totalPayout,
        result: [...result],
      }
    },

    getMemberPayouts: async () => {
      let { db } = await connectToDatabase();

      const member = await db.collection("member").aggregate([{
        $lookup: {
          from: 'payout',
          'let': {
            member_email: '$email'
          },
          pipeline: [
            {
              $match: {
                payoutDate: RegExp("2022-09")
              }
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        '$pic',
                        '$$member_email'
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: 'payout'
        }
      }, {
        $facet: {
          notPaid: [
            {
              $match: {
                payout: {
                  $size: 0
                }
              }
            },
            {
              $project: {
                email: '$email'
              }
            }
          ],
          paid: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $ne: [
                        '$payout',
                        []
                      ]
                    }
                  ]
                }
              }
            },
            {
              $project: {
                email: '$email',
                confirmedPayout: {
                  $size: {
                    $filter: {
                      input: '$payout',
                      as: 'pay',
                      cond: {
                        $eq: [
                          '$$pay.status',
                          'confirmed'
                        ]
                      }
                    }
                  }
                },
                unconfirmedPayout: {
                  $size: {
                    $filter: {
                      input: '$payout',
                      as: 'pay',
                      cond: {
                        $eq: [
                          '$$pay.status',
                          'unconfirmed'
                        ]
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      }]).toArray()

      return ({ notPaid: member[0].notPaid, paid: member[0].paid })
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
          await db.collection("member").insertOne({ name: name, email: email, class: classData, phone: phone, bio: bio, role: role, _lastUpdate: new Date().toISOString(), _createdAt: new Date().toISOString() });

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
          db.collection("member").updateOne({ email: email }, { $set: { name: name, class: classData, phone: phone, bio: bio, _lastUpdate: new Date().toISOString() } })
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
    },

    addTransaction: async (_: any, { name, transactionDate, amount, pic, evidence, status }: { name: string, transactionDate: string, amount: number, pic: string, evidence: string, status: string }) => {
      let { db } = await connectToDatabase();
      try {
        await db.collection("transaction").insertOne({ name, transactionDate, amount, pic, evidence, status, confirmedBy: "", _lastUpdate: new Date().toISOString(), _createdAt: new Date().toISOString() });
        return ({ success: true, message: 'Transaction data submitted.' })
      } catch (error) {
        return ({ success: false, message: error })
      }
    },
    editTransaction: async (_: any, { _id, name, transactionDate, amount, pic, evidence, status }: { _id: string, name: string, transactionDate: string, amount: number, pic: string, evidence: string, status: string }) => {
      let { db } = await connectToDatabase();

      const transaction = await db.collection("transaction").findOne({ _id: new ObjectId(_id) });

      if (transaction !== null) {

        try {
          // ypdate status only
          if (name == undefined || name == "") {
            db.collection("transaction").updateOne({ _id: new ObjectId(_id) }, { $set: { status: "confirmed", confirmedBy: pic, _lastUpdate: new Date().toISOString() } })
            return ({ success: true, message: 'Transaction data status updated.' })
          }
          // update all data
          else {
            db.collection("transaction").updateOne({ _id: new ObjectId(_id) }, { $set: { name, transactionDate, amount, evidence, _lastUpdate: new Date().toISOString() } })
            return ({ success: true, message: 'Transaction data updated.' })
          }
        } catch (error) {
          return ({ success: false, message: error })
        }

      } else {
        return ({ success: false, message: 'Transaction data not found.' })
      }
    },
    deleteTransaction: async (_: any, { _id }: { _id: string }) => {
      let { db } = await connectToDatabase();
      const transaction = await db.collection("transaction").findOne({ _id: new ObjectId(_id) });

      if (transaction !== null) {
        try {
          await db.collection("transaction").deleteOne({ _id: new ObjectId(_id) })
          return ({ success: true, message: 'Transaction data deleted.' })
        } catch (error) {
          return ({ success: error, message: error })
        }
      } else {
        return ({ success: false, message: 'Transaction data not found.' })
      }
    },

    addPayout: async (_: any, { pic, payoutDate, amount, evidence, status }: { pic: string, payoutDate: string, amount: number, evidence: string, status: string }) => {
      let { db } = await connectToDatabase();
      try {
        await db.collection("payout").insertOne({ pic, payoutDate, amount, evidence, status, confirmedBy: "", _lastUpdate: new Date().toISOString(), _createdAt: new Date().toISOString() });
        return ({ success: true, message: 'Payout data submitted.' })
      } catch (error) {
        return ({ success: false, message: error })
      }
    },
    editPayout: async (_: any, { _id, pic, payoutDate, amount, evidence, status }: { _id: string, pic: string, payoutDate: string, amount: number, evidence: string, status: string }) => {
      let { db } = await connectToDatabase();

      const payout = await db.collection("payout").findOne({ _id: new ObjectId(_id) });

      if (payout !== null) {

        try {
          // ypdate status only
          if (amount == undefined || amount == 0) {
            db.collection("payout").updateOne({ _id: new ObjectId(_id) }, { $set: { status: "confirmed", confirmedBy: pic, _lastUpdate: new Date().toISOString() } })
            return ({ success: true, message: 'Payout data status updated.' })
          }
          // update all data
          else {
            db.collection("payout").updateOne({ _id: new ObjectId(_id) }, { $set: { pic, payoutDate, amount, evidence, _lastUpdate: new Date().toISOString() } })
            return ({ success: true, message: 'Payout data updated.' })
          }
        } catch (error) {
          return ({ success: false, message: error })
        }

      } else {
        return ({ success: false, message: 'Payout data not found.' })
      }
    },
    deletePayout: async (_: any, { _id }: { _id: string }) => {
      let { db } = await connectToDatabase();
      const payout = await db.collection("payout").findOne({ _id: new ObjectId(_id) });

      if (payout !== null) {
        try {
          await db.collection("payout").deleteOne({ _id: new ObjectId(_id) })
          return ({ success: true, message: 'Payout data deleted.' })
        } catch (error) {
          return ({ success: error, message: error })
        }
      } else {
        return ({ success: false, message: 'Payout data not found.' })
      }
    }
  }
}