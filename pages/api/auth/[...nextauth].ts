import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const query = `query GetAuth {
          getAuth(email: "${credentials?.email}", password: "${credentials?.password}") {
            status {
              success
              message
            }
            member {
              name
              email
              _id
            }
          }
        }`

        try {
          const res = await axios.post('http://localhost:3000/api/graphql', { query });

          if (res) {
            const status = res.data.data.getAuth.status;
            const member = res.data.data.getAuth.member;

            if (status.success == true) {
              return {
                id: member._id,
                name: member.name,
                email: member.email,
              }
            }
            else {
              return Promise.reject(new Error(status.message))
            }
          }
        } catch (error) {
          throw new Error(String(error))
        }

        return null
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: '/auth',
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  }
});