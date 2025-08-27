import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { Provider } from "next-auth/providers"
 
const providers: Provider[] = [
  GitHub,
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
      }
      return token;
    },
    authorized: async ({ auth }) => { return !!auth },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
})

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")