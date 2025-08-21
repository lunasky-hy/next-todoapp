import Link from 'next/link';
 
export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h2 className="text-4xl font-bold mb-4">404 Not Found</h2>
      <p className="text-lg mb-8">指定されたタスクは見つかりませんでした。</p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        ホームに戻る
      </Link>
    </main>
  );
}
