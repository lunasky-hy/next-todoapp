"use client";

import { useState } from 'react';
import { sampleTodos, categories } from '@/app/models/sampledata';
import TaskDetail from '@/app/ui/task-detail';
import TaskListItem from '@/app/ui/task-listitem';
import TaskCreateForm from './ui/task-create-form';

// ホームページコンポーネント
export default function HomePage() {  
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('すべて');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);


  // 新しいToDoを追加する処理
  const handleAddTodo = (newItem: Todo) => {
    setTodos([
      ...todos,
      newItem,
    ]);
    return true;
  };

  // ToDoの完了状態を切り替える処理
  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // ToDoを削除する処理
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    // 削除したタスクが詳細表示中のタスクであれば、詳細表示を閉じる
    if (selectedTodo && selectedTodo.id === id) {
        setSelectedTodo(null);
    }
  };

  // 選択されたカテゴリに基づいてToDoをフィルタリング
  const filteredTodos = todos.filter(todo =>
    selectedCategory === 'すべて' ? true : todo.category === selectedCategory
  );

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex w-full max-w-6xl h-[90vh] mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800 overflow-hidden">
        
        {/* 左パネル: ToDoリスト */}
        <div className={`flex flex-col p-6 transition-all duration-300 ease-in-out ${selectedTodo ? 'w-1/2' : 'w-full'}`}>
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
              ToDoリスト
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              今日やるべきことを管理しましょう
            </p>
          </header>

          <TaskCreateForm selectedCategory={selectedCategory} handleCreate={(i) => handleAddTodo(i)} />

          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 -mb-px font-semibold text-sm transition-colors duration-200 focus:outline-none ${
                  selectedCategory === category
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex-grow space-y-4 overflow-y-auto pr-2">
            {filteredTodos.map((todo) => <TaskListItem 
              key={todo.id}
              todo={todo} 
              handleOnSelect={(i) => setSelectedTodo(i)} 
              handleToggleStatus={(i) => handleToggleTodo(i.id)} 
              handleDelete={(i) => handleDeleteTodo(i.id)} 
            />)}
          </div>

          <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 shrink-0">
            <p>
              {filteredTodos.filter((t) => !t.completed).length}個のタスクが残っています
            </p>
          </footer>
        </div>
        
        {/* 右パネル: タスク詳細 */}
        {selectedTodo && <TaskDetail todo={selectedTodo} handleCloseItem={() => setSelectedTodo(null)} />}
      </div>
    </main>
  );
}
