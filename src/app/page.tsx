import TaskDetail from '@/app/ui/taskDetail';
import TaskList from '@/app/ui/taskList';
import { getCategories, getTasks } from './lib/actions/taskActions';

export default async function HomePage(props: { 
  searchParams?: Promise<{
    selected?: string;
}>}) {
  const searchParamsTask = props.searchParams;
  const [searchParams, todos, categories] = await Promise.all([
      searchParamsTask, 
      getTasks(), 
      getCategories(),
  ]);
  
  const selectedTodoId = searchParams?.selected;
  const selectedTodo = todos?.find((todo) => todo.id == selectedTodoId);

  console.log(categories);

  return (
    <main className="flex justify-center bg-gray-100 dark:bg-gray-900 pt-8 pb-8">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800 overflow-hidden ml-3 mr-3">
        
        {/* 左パネル: ToDoリスト */}
        <div className={`flex flex-col p-6 transition-all duration-300 ease-in-out h-full ${selectedTodoId ? 'w-1/2' : 'w-full'}`}>
          <TaskList todos={todos} categories={categories} />
        </div>
        
        {/* 右パネル: タスク詳細 */}
        {selectedTodo && <TaskDetail todo={selectedTodo} />}
      </div>
    </main>
  );
}