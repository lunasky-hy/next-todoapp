
import { signIn } from "@/app/lib/auth" // if use client side signin, this import is enabled.
 
export default function SignIn() {
  const handleSignIn = async () => {
    'use server'
    await signIn("github");
  }

  return (
    <form action={handleSignIn}>
      <button type="submit">Signin with GitHub</button>
    </form>
  );
} 

// Client Side Login
// import { signIn } from "next-auth/react" // if use client side signin, this import is enabled.
// export function SignInClient() {
//   return <button onClick={() => signIn("github")}>SignIn</button>
// }