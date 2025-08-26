import TaskDetail from '@/app/ui/task-detail';
import { getTasks } from '@/app/repos/database';
import TaskList from '@/app/ui/task-list';

// ホームページコンポーネント
export default async function HomePage(props: { 
  searchParams?: Promise<{
    selected?: string;
}>}) {
  const searchParams = await props.searchParams;
  const selectedTodoId = searchParams?.selected;

  const todos = await getTasks();
  const selectedTodo = todos?.find((todo) => todo.id == selectedTodoId);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex w-full max-w-6xl h-[90vh] mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800 overflow-hidden">
        
        {/* 左パネル: ToDoリスト */}
        <div className={`flex flex-col p-6 transition-all duration-300 ease-in-out ${selectedTodoId ? 'w-1/2' : 'w-full'}`}>
          <TaskList todos={todos} />
        </div>
        
        {/* 右パネル: タスク詳細 */}
        {selectedTodo && <TaskDetail todo={selectedTodo} />}
      </div>
    </main>
  );
}
