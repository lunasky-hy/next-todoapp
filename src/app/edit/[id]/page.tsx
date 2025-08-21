import { getTaskById, updateTask } from '@/app/repos/database';
import { CloseIcon } from '@/app/ui/svg-icons';
import NotFound from '@/app/edit/[id]/not-found';
import TaskEdit from '@/app/ui/task-edit-form';
import Link from 'next/link';

type EditTaskPageProps = {
  params: Promise<{ // URLparamsを取得する部分をPromiseにして。
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const id = (await params).id;
  const initTodo = await getTaskById(id);

  if(!initTodo) {
    return NotFound();
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-8 h-[90vh] bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">タスク編集</h2>
          <Link href={"/"}>
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ">
              <CloseIcon />
            </button>
          </Link>
        </div>
          <TaskEdit todo={initTodo} categories={['仕事', 'プライベート']} />
      </div>
    </main>
  );
}
