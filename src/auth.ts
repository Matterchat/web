import { WebSecrets } from "@matterchat/config";
import NextAuth, { Session } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: WebSecrets.keycloak.clientId,
      clientSecret: WebSecrets.keycloak.clientSecret,
      issuer: WebSecrets.keycloak.issuer,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      (
        session as Session & {
          accessToken: string;
        }
      ).accessToken = token.accessToken as string;
      return session;
    },
  },
});
