//? NEXTAUTH@BETA - Authentication Configuration
import NextAuth from "next-auth";
//? GITHUB PROVIDER - OAuth
import GitHub from "next-auth/providers/github";

//* Configured NextAuth instance
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/login",
  },
});
