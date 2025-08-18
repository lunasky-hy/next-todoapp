import { CloseIcon } from "@/app/ui/svg-icons";

type TaskDetailProps = {
  todo: Todo;
  handleCloseItem: () => void;
} 

export default function TaskDetail({ todo, handleCloseItem }: TaskDetailProps ) {
  return (
    <div className="w-1/2 p-8 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">タスク詳細</h2>
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
      </div>
    </div>
  )
}