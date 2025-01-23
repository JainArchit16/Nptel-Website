import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
          // console.log(user);
          if (
            user &&
            (await bcrypt.compare(credentials.password, user.passwordHash))
          ) {
            // Authentication successful
            return {
              id: user.userId,
              name: user.name,
              email: user.email,
              user,
            };
          }

          // Authentication failed
          return null;
        } catch (error) {
          console.error("Error in authorize:", error);
          return false;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log(user);
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        const user = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });

        if (user) {
          session.user.name = user.name;
        }
      }
      return session;
    },
  },
};
