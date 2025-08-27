'use client'

import { Todo } from "@/app/lib/models/todoItem";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateTask } from "@/app/lib/repos/task-repository";

type TaskEditProps = {
  todo: Todo;
  categories: Array<string>;
}

export default function TaskEdit({ todo, categories }: TaskEditProps) {
  const [editTodo, setEditTodo] = useState(todo);
  const router = useRouter();

  const setText = (t: string) => setEditTodo({ ...editTodo, text: t});
  const setCategory = (t: string) => setEditTodo({ ...editTodo, category: t});
  const setNote = (t: string) => setEditTodo({ ...editTodo, note: t ? t : undefined});

  const handleClose = () => {
    router.push(`/?selected=${todo.id}`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask(editTodo);
    router.push(`/?selected=${editTodo.id}`);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">タスク内容</label>
        <input
          type="text"
          id="text"
          value={editTodo.text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">カテゴリ</label>
        <select
          id="category"
          value={todo.category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {categories.filter(cat => cat !== 'すべて').map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ノート (任意)</label>
        <textarea
          id="note"
          value={todo.note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          保存
        </button>
      </div>
    </form>
  );
}