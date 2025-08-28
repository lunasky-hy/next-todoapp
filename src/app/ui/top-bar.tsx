import { DefaultUserIcon } from "@/app/ui/svg-icons";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import SignOut from "./auth/sign-out";
import Image from "next/image";

export default async function TopBar() {
  const session = await auth();
  const isSignedIn = session?.user ? true : false;

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 左側のアプリケーション名 */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">TodoApp</h1>
          </div>

          {/* 右側のアカウント情報 */}
          <div className="flex items-center">
            {isSignedIn ? (
              // --- サインインしている場合の表示 ---
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  { session?.user?.image ? 
                    <Image src={session.user.image} alt='user profile image' width={32} height={32} className="rounded-full" /> :
                    <DefaultUserIcon className="h-8 w-8 rounded-full text-gray-400 bg-gray-100 p-1" />
                  }
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {session?.user?.name}
                  </div>
                </div>
                <SignOut />
              </div>
            ) : (
              // --- サインアウトしている場合の表示 ---
              <div className="flex items-center">
                <Link href="/auth/signin">
                  <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                  >
                    サインイン
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}