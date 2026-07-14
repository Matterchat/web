import { WebSecrets } from "@matterchat/config";
import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";
import axios from "axios";

/**
 * Exchanges the refresh_token for a new access_token when it is close to expiry.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const issuer = WebSecrets.keycloak.issuer;
    const url = `${issuer}/protocol/openid-connect/token`;

    const { data } = await axios.post(
      url,
      new URLSearchParams({
        client_id: WebSecrets.keycloak.clientId || "",
        client_secret: WebSecrets.keycloak.clientSecret || "",
        grant_type: "refresh_token",
        refresh_token: (token.refreshToken as string) || "",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return {
      ...token,
      accessToken: data.access_token,
      idToken: data.id_token ?? token.idToken,
      expiresAt: Date.now() + (data.expires_in ?? 300) * 1000, // expires_in is in seconds, convert to milliseconds
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing keycloak access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: WebSecrets.keycloak.clientId,
      clientSecret: WebSecrets.keycloak.clientSecret,
      issuer: WebSecrets.keycloak.issuer,
      authorization: {
        params: { scope: "openid profile email offline_access" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + ((account.expires_in as number) ?? 300) * 1000;
      }

      const expiresAt = token.expiresAt as number | undefined;

      // If the token is not expired (with 10s buffer), return it
      if (expiresAt && Date.now() < expiresAt - 10000) return token;

      // If token has expired or is about to, refresh it
      if (token.refreshToken) return refreshAccessToken(token);

      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).idToken = token.idToken;
      (session as any).error = token.error;

      return session;
    },
  },
});
