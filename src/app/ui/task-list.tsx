'use client'

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TaskListItem from "@/app/ui/task-listitem";
import TaskCreateForm from "@/app/ui/task-create-form";
import { updateTask, deleteTask } from "@/app/lib/repos/task-repository";
import { Todo } from "@/app/lib/models/todoItem";

type TaskListProps = {
  todos: Array<Todo>;
  categories: Array<string>;
}

export default function TaskList({ todos, categories }: TaskListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const router = useRouter();  
  const pathname = usePathname();

  const handleOnSelect: (todo: Todo) => void = (todo) => {
    const params = new URLSearchParams();
    params.set('selected', todo.id.toString());
    router.push(`${pathname}?${params.toString()}`)
  };

  const handleToggleStatus: (id: string) => void = async (id) => {
    const todo = todos?.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      await updateTask(todo);
    }
    router.refresh();
  };

  const handleDelete: (id: string) => void = async (id) => {
    await deleteTask(id);
    router.refresh();
  };

  return (<>
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        ToDoリスト
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        今日やるべきことを管理しましょう
      </p>
    </div>

    {/* 新規追加フォーム */}
    <TaskCreateForm 
      selectedCategory={selectedCategory}
    />
      
    {/* カテゴリ選択 */}
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
      {['', ...categories].map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 -mb-px font-semibold text-sm transition-colors duration-200 focus:outline-none ${
            selectedCategory === category
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {category === '' ? 'すべて' : category}
        </button>
      ))}
    </div>

    {/* 一覧 */}
    <div className="flex-grow space-y-4 overflow-y-auto">
      {todos?.filter((it) => selectedCategory === '' ? true : it.category === selectedCategory)
        .map((todo) => <TaskListItem 
          key={todo.id}
          todo={todo} 
          handleOnSelect={(i) => handleOnSelect(i)} 
          handleToggleStatus={(i) => handleToggleStatus(i.id)} 
          handleDelete={(i) => handleDelete(i.id)} 
        />)
      }  
    </div>
    <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 shrink-0">
      <p>
        {todos?.filter((t) => !t.completed).length}個のタスクが残っています
      </p>
    </footer>
  </>);    
}