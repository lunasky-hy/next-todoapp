// app/page.tsx
"use client"; // useStateやイベントハンドラを使用するため、クライアントコンポーネントとして宣言します

import { useState } from 'react';

// ToDoアイテムの型定義
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  category: '仕事' | 'プライベート' | '学習';
};

// サンプルのToDoデータ
const sampleTodos: Todo[] = [
  { id: 1, text: 'Next.jsのプロジェクトをセットアップする', completed: true, category: '仕事' },
  { id: 2, text: 'Tailwind CSSを導入する', completed: true, category: '仕事' },
  { id: 3, text: 'React Hooksのドキュメントを読む', completed: false, category: '学習' },
  { id: 4, text: '買い物に行く', completed: false, category: 'プライベート' },
  { id: 5, text: '新しいToDoアプリのUIをデザインする', completed: false, category: '仕事' },
  { id: 6, text: '英語の単語を10個覚える', completed: true, category: '学習' },
];

// カテゴリの定義
const categories: ('すべて' | Todo['category'])[] = ['すべて', '仕事', 'プライベート', '学習'];


// SVGアイコンコンポーネント
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);


// ホームページコンポーネント
export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('すべて');

  // 新しいToDoを追加する処理
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    
    // 「すべて」が選択されている場合は「仕事」カテゴリにデフォルトで追加
    const categoryToAdd = selectedCategory === 'すべて' ? '仕事' : selectedCategory;

    setTodos([
      ...todos,
      { id: Date.now(), text: newTodo, completed: false, category: categoryToAdd },
    ]);
    setNewTodo('');
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
  };

  // 選択されたカテゴリに基づいてToDoをフィルタリング
  const filteredTodos = todos.filter(todo =>
    selectedCategory === 'すべて' ? true : todo.category === selectedCategory
  );

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            ToDoリスト
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            今日やるべきことを管理しましょう
          </p>
        </header>

        {/* ToDo追加フォーム */}
        <form onSubmit={handleAddTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="新しいタスクを追加..."
              className="flex-grow p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button type="submit" className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
              追加
            </button>
          </div>
        </form>

        {/* カテゴリタブ */}
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

        {/* ToDoリスト */}
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                todo.completed
                  ? 'bg-green-50 dark:bg-green-900/50'
                  : 'bg-white dark:bg-gray-700'
              } border border-gray-200 dark:border-gray-600 shadow-sm`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              />
              <span
                className={`flex-grow mx-4 text-lg ${
                  todo.completed
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {todo.text}
              </span>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  <EditIcon />
                </button>
                <button onClick={() => handleDeleteTodo(todo.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-8 text-center text-gray-500 dark:text-gray-400">
          <p>
            {filteredTodos.filter((t) => !t.completed).length}個のタスクが残っています
          </p>
        </footer>
      </div>
    </main>
  );
}
