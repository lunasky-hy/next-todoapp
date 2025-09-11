import TaskDatabase from "@/app/lib/models/taskDatabase";
import DemoDatabase from "@/app/lib/repos/demoDatabase";
import FirestoreTaskDatabase from "./firestoreTaskDatabase";

const demoRepository: TaskDatabase = new DemoDatabase();
let taskRepository: TaskDatabase;

if (process.env.NODE_ENV === 'production') {
  taskRepository = new FirestoreTaskDatabase();
} else {
  taskRepository = demoRepository;
}

export { taskRepository, demoRepository };

