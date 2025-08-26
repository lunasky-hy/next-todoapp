
import { signOut } from "@/app/lib/auth" // if use client side signin, this import is enabled.
 
export default function SignIn() {
  const handleSignIn = async () => {
    'use server'
    await signOut();
  }

  return (
    <form action={handleSignIn}>
      <button type="submit">Signin with GitHub</button>
    </form>
  );
} 

// Client Side Login
// import { signOut } from "next-auth/react" // if use client side signin, this import is enabled.
// export function SignInClient() {
//   return <button onClick={() => signOut("github")}>SignIn</button>
// }