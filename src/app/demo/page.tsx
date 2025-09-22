import TaskList from "@/app/ui/taskList";
import TaskDetail from "@/app/ui/taskDetail";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { getTasks } from "@/app/lib/actions/taskActions";
import { getCategories } from "@/app/lib/actions/categoryActions";

export default async function DemoPage(props: { 
  searchParams?: Promise<{
    selected?: string;
}>}) {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  const [searchParams, todos, categories] = await Promise.all([
      props.searchParams, 
      getTasks('', true),
      getCategories(true),
  ]);

  const selectedTodoId = searchParams?.selected;
  const selectedTodo = todos?.find((todo) => todo.id == selectedTodoId);
  
  return (
    <main className="flex justify-center bg-gray-100 dark:bg-gray-900 pt-8 pb-8">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800 overflow-hidden">
        
        {/* 左パネル: ToDoリスト */}
        <div className={`flex flex-col p-6 transition-all duration-300 ease-in-out ${selectedTodoId ? 'w-1/2' : 'w-full'}`}>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">注意：このデモページで登録されたタスクはタブを閉じると消えます。</p>
          <TaskList todos={todos} categories={categories} isDemo={true} />
        </div>
        
        {/* 右パネル: タスク詳細 */}
        {selectedTodo && <TaskDetail todo={selectedTodo} />}
      </div>
    </main>
  );
}