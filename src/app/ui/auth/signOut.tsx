
import { signOut } from "@/app/lib/auth" // if use client side signin, this import is enabled.
 
export default function SignOut() {
  const handleSignOut = async () => {
    'use server'
    await signOut({redirectTo: '/auth/signin'});
  }

  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
      >
        サインアウト
      </button>
    </form>
  );
} 

// Client Side Login
// import { signOut } from "next-auth/react" // if use client side signin, this import is enabled.
// export function SignInClient() {
//   return <button onClick={() => signOut("github")}>SignIn</button>
// }