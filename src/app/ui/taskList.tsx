'use client'

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TaskListItem from "@/app/ui/taskListItem";
import TaskCreateForm from "@/app/ui/form/taskCreateForm";
import { Todo } from "@/app/lib/models/todoItem";
import AddCategoryPopOver from "@/app/ui/categoryPopover";
import { createTask, deleteTask, getTasks, updateTask } from "@/app/lib/actions/taskActions";
import { createCategory, deleteCategory, getCategories } from "@/app/lib/actions/categoryActions";

type TaskListProps = {
  todos: Array<Todo>;
  categories: Array<string>;
  isDemo?: boolean;
}

export default function TaskList(props: TaskListProps) {
  const [todos, setTodos] = useState(props.todos);
  const [categories, setCategories] = useState(props.categories);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isVisiblePopover, setVisiblePopover] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectTask: (id: string) => void = (id) => {
    const params = new URLSearchParams();
    params.set('selected', id);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleTaskStatusToggle: (todo: Todo) => void = (todo) => {
    updateTask({...todo, completed: !(todo.completed)}, props.isDemo).then(() => {
      getTasks('', props.isDemo).then((data) => setTodos(data));
    });
  };

  const handleTaskCreate: (todo: Todo) => Promise<boolean> = async (todo) => {
    try {
      const id = await createTask(todo, props.isDemo);
      setTodos(await getTasks('', props.isDemo));
      handleSelectTask(id);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  const handleTaskDelete: (id: string) => void = async (id) => {
    await deleteTask(id, props.isDemo);
    getTasks('', props.isDemo).then((data) => setTodos(data));
  };

  const handleCategoryCreate: (text: string) => void = async (text) => {
    try {
      const updated = await createCategory(text, props.isDemo)
      setCategories(updated);
      setVisiblePopover(false);
    } catch (e) {
      console.error(e);
    }
  }

  const handleCategoryDelete: () => void = async () => {
    try {
      await deleteCategory(selectedCategory, props.isDemo);
      setCategories(await getCategories(props.isDemo));
      setSelectedCategory('');
    } catch (e) {
      console.error(e);
    }
  }
  
  const filteredTodos = todos?.filter((it) => selectedCategory === '' ? true : it.category === selectedCategory);// <--- ここのフィルターを止める（DB側でフィルター）
  const uncheckedTasks = filteredTodos?.filter((t) => !t.completed).length;

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
      handleCreate={handleTaskCreate}
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
      <div className="relative">
        <button
          onClick={() => {setVisiblePopover(!isVisiblePopover)}}
          className={'px-4 py-2 -mb-px font-semibold text-sm transition-colors duration-200 focus:outline-none border-b-2 border-transparent text-blue-500 hover:text-blue-700 dark:hover:text-blue-300'}
        >
          ＋カテゴリ追加
        </button>
        {isVisiblePopover &&
          <AddCategoryPopOver
            onBlur={() => setVisiblePopover(false)}
            handleCreate={handleCategoryCreate}
          />}
      </div>
    </div>

    {/* 一覧 */}
    <div className="space-y-4 overflow-y-auto">
      {filteredTodos.map((todo) => <TaskListItem 
          key={todo.id}
          todo={todo} 
          handleOnSelect={(t) => handleSelectTask(t.id)} 
          handleToggleStatus={(i) => handleTaskStatusToggle(i)} 
          handleDelete={(i) => handleTaskDelete(i.id)} 
        />)
      }
      {filteredTodos.length === 0 && 
        <div className="flex flex-col items-center justify-center h-20 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <p className="text-gray-500 dark:text-gray-400">タスクがありません。</p>
          <button className="text-blue-500 dark:text-gray-400 hover:font-bold mt-2" onClick={handleCategoryDelete}>カテゴリを削除？</button>
        </div>
      }
    </div>
    <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 shrink-0">
      { uncheckedTasks > 0 && 
        <p>
          {uncheckedTasks}個のタスクが残っています
        </p>
      }
    </footer>
  </>);    
}