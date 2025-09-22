import { signIn } from "@/app/lib/auth"
import { GitHubSsoIcon } from "@/app/ui/auth/sso-icons"
import Link from "next/link"
 
export default async function SignInPage() {
  const handleSignInGitHub = async () => {
    'use server'
    await signIn("github", { redirectTo: "/" });
  }
  // const handleSignInGoogle = async () => {
  //   'use server'
  //   await signIn("google");
  // }

  return (
    <main className="flex items-center justify-center  bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Todoアプリにサインイン
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            下記のサービスを利用してサインイン
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          {/* Googleサインインボタン */}
          {/* <GoogleSsoIcon 
            onClick={() => signIn('google', { callbackUrl: '/' })} /> */}
          {/* GitHubサインインボタン */}
          <GitHubSsoIcon onClick={handleSignInGitHub} />
        </div>
        <div className="text-center w-full">
          <Link href="/demo" className="text-gray-600 text-sm">
              デモページでお試し
          </Link>
        </div>
      </div>
    </main>
  )
}