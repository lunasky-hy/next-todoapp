'use client'

import { CloseIcon, EditIcon } from "@/app/ui/common/svgIcons";
import { usePathname, useRouter } from 'next/navigation';
import { Todo } from "@/app/lib/models/todoItem";
import Link from "next/link";

type TaskDetailProps = {
  todo: Todo;
} 

export default function TaskDetail({ todo }: TaskDetailProps ) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCloseItem = () => {
    router.push(pathname);
  }

  return (
    <div className="w-1/2 p-8 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">タスク詳細</h2>
          <Link href={`/edit/${todo.id}`}>
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 transition-colors duration-200 ml-1">
              <EditIcon />
            </button>
          </Link>
        </div>
        <button onClick={() => handleCloseItem()} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
          <CloseIcon />
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">タスク内容</label>
          <p className="p-3 bg-white dark:bg-gray-700 rounded-md text-lg text-gray-900 dark:text-gray-100">{todo.text}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">カテゴリ</label>
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">{todo.category}</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">状態</label>
          <p className={`inline-flex items-center text-lg font-semibold ${todo.completed ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
            {todo.completed ? '完了' : '未完了'}
          </p>
        </div>
        {todo.note && (
          <div>
            <label className="block text-sm font-small text-gray-500 dark:text-gray-400 mb-1">ノート</label>
            <p className="p-3 bg-white dark:bg-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100">{todo.note}</p>
          </div>
        )}
      </div>
    </div>
  )
}