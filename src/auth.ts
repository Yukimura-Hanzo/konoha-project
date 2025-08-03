//? NEXTAUTH@BETA - Authentication Configuration
import NextAuth from "next-auth";
//? GITHUB PROVIDER - OAuth
import GitHub from "next-auth/providers/github";
//? NEON
import { sql } from "./lib/db";

//* Configured NextAuth instance
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      //* Store GitHub ID as UUID only on first sign in
      const githubId = profile?.id; // ← this is stable GitHub user ID (number)
      // const email = user.email;

      //? Create or upsert user into oauth_users table
      await sql`
        INSERT INTO oauth_users (id, provider, name, email, image)
        VALUES (${githubId}, ${account?.provider}, ${user.name}, ${user.email}, ${user.image})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          image = EXCLUDED.image
      `;

      return true;
    },
    async session({ session, token }) {
      //* Ensure session carries the stable GitHub ID (as string)
      session.user.id = String(token.sub); //* this is GitHub profile.id
      return session;
    },
    async jwt({ token, profile }) {
      if (profile?.id) {
        token.sub = String(profile.id); //* GitHub user ID
      }
      return token;
    },
  },
});
