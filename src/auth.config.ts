import type {NextAuthConfig} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import {users} from "../users";
import {connectDB} from "@/app/lib/mongodb";
import User from "@/app/lib/models/User/User";

export default {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'text'},
        password: {label: 'Password', type: 'password'},
        rememberMe: { label: 'Remember', type: 'checkbox' },
      },
      async authorize(credentials: any) {
        await connectDB();
        const user = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (user) {
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({user, account}) {
      return account?.provider == 'credentials';
    },
  },
} satisfies NextAuthConfig;
