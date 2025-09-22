"use client"

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Todo } from "@/app/lib/models/todoItem";
import { createTask } from "@/app/lib/actions/taskActions";

type TaskCreateFormProps = {
  selectedCategory: string;
  isDemo?: boolean;
}

export default function TaskCreateForm({ selectedCategory, isDemo = false }: TaskCreateFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const eventAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim() === '') return;

    const newTodo: Todo = {
      id: '',
      text: newTodoTitle,
      completed: false,
      category: selectedCategory === 'すべて' ? '仕事' : selectedCategory,
    }

    const newTaskId = await createTask(newTodo, isDemo);

    if (newTaskId !== "") {
      const param = new URLSearchParams();
      param.set('selected', newTodo.id.toString());
      router.push(`${pathname}?${param.toString()}`);
      setNewTodoTitle('');
    }
  }

  return (

    <form onSubmit={eventAddTodo} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="新しいタスクを追加..."
          className="flex-grow p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button type="submit" className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
          追加
        </button>
      </div>
    </form>);
}