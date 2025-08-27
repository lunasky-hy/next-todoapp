
import { signOut } from "@/app/lib/auth" // if use client side signin, this import is enabled.
 
export default function SignOut() {
  const handleSignOut = async () => {
    'use server'
    await signOut({redirectTo: '/auth/signin'});
  }

  return (
    <form action={handleSignOut}>
      <button type="submit">Signout</button>
    </form>
  );
} 

// Client Side Login
// import { signOut } from "next-auth/react" // if use client side signin, this import is enabled.
// export function SignInClient() {
//   return <button onClick={() => signOut("github")}>SignIn</button>
// }