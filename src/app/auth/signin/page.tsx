import { redirect } from "next/navigation"
import { signIn, auth, providerMap } from "@/app/lib/auth"
import { AuthError } from "next-auth"
import { GitHubSsoIcon, GoogleSsoIcon } from "@/app/ui/auth/sso-icons"
 
const SIGNIN_ERROR_URL = "/error"
 
export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const handleSignInGitHub = async () => {
    'use server'
    await signIn("github");
  }
  // const handleSignInGoogle = async () => {
  //   'use server'
  //   await signIn("github");
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Choose one of the following providers
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          {/* Googleサインインボタン */}
          <GoogleSsoIcon 
            // onClick={() => signIn('google', { callbackUrl: '/' })} />
          />
          {/* GitHubサインインボタン */}
          <GitHubSsoIcon onClick={handleSignInGitHub} />
        </div>
      </div>
    </div>
    // <div className="flex flex-col gap-2">
    //   {Object.values(providerMap).map((provider) => (
    //     <form
    //       key={provider.id}
    //       action={async () => {
    //         "use server"
    //         try {
    //           await signIn(provider.id, {
    //             redirectTo: props.searchParams?.callbackUrl ?? "",
    //           })
    //         } catch (error) {
    //           // Signin can fail for a number of reasons, such as the user
    //           // not existing, or the user not having the correct role.
    //           // In some cases, you may want to redirect to a custom error
    //           if (error instanceof AuthError) {
    //             return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
    //           }
 
    //           // Otherwise if a redirects happens Next.js can handle it
    //           // so you can just re-thrown the error and let Next.js handle it.
    //           // Docs:
    //           // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    //           throw error
    //         }
    //       }}
    //     >
    //       <button type="submit">
    //         <span>Sign in with {provider.name}</span>
    //       </button>
    //     </form>
    //   ))}
    // </div>
  )
}