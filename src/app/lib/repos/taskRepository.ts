'use server'
import TaskDatabase from "@/app/lib/models/taskDatabase";
import DemoDatabase from "@/app/lib/repos/demoDatabase";
import FirestoreTaskDatabase from "@/app/lib/repos/firestoreTaskDatabase";

const demoRepository: TaskDatabase = new DemoDatabase();

export async function getTaskRepository(idDemo: boolean = false) {
  let taskRepository: TaskDatabase;

  if (process.env.NODE_ENV === 'production') {
    taskRepository = new FirestoreTaskDatabase();
  } else if (process.env.CONNECT_FIRESTORE === 'true'){
    taskRepository = new FirestoreTaskDatabase();
  } else {
    taskRepository = demoRepository;
  }
  return idDemo ? demoRepository : taskRepository;
}