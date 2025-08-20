import { EditIcon, TrashIcon } from "@/app/ui/svg-icons";
import { Todo } from "@/app/models/todoItem";

type TaskListItemProps = {
  todo: Todo;
  handleOnSelect: (todo: Todo) => void;
  handleToggleStatus: (todo: Todo) => void;
  handleDelete: (todo: Todo) => void;
}

export default function TaskListItem(props: TaskListItemProps) {
  return (
    <div
      onDoubleClick={() => props.handleOnSelect(props.todo)}
      className={`flex items-center p-4 rounded-lg transition-all duration-300 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 ${props.todo.completed
          ? 'bg-green-50 dark:bg-green-900/50'
          : 'bg-white dark:bg-gray-700'
        } border border-gray-200 dark:border-gray-600 shadow-sm`}
    >
      <input
        type="checkbox"
        checked={props.todo.completed}
        onChange={() => props.handleToggleStatus(props.todo)}
        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
      />
      <span
        className={`flex-grow mx-4 text-lg ${props.todo.completed
            ? 'line-through text-gray-400 dark:text-gray-500'
            : 'text-gray-700 dark:text-gray-200'
          }`}
      >
        {props.todo.text}
      </span>
      <div className="flex items-center space-x-3">
        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
          <EditIcon />
        </button>
        <button onClick={(e) => { e.stopPropagation(); props.handleDelete(props.todo); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}