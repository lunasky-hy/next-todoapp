
import db from "@/app/lib/repos/firebase/firebase";
import { Todo } from "@/app/lib/models/todoItem";
import { addDoc, collection, deleteDoc, doc, FirestoreDataConverter, getDoc, getDocs, query, QueryDocumentSnapshot, SnapshotOptions, updateDoc, where } from "firebase/firestore";
import { auth } from "@/app/lib/auth";
import TaskDatabase from "@/app/lib/models/taskDatabase";

export default class FirestoreTaskDatabase implements TaskDatabase {

  private todoConverter: FirestoreDataConverter<Todo> = {
    toFirestore: (task: Todo) => {
      return {
        text: task.text,
        note: task.note,
        completed: task.completed,
        category: task.category,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
    },

    fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Todo => {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        text: data.text,
        note: data.note,
        completed: data.completed,
        category: data.category,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    },
  };

  async getTasks(category?: string): Promise<Array<Todo>> {
    const session = await auth();
    if (!session?.user) {
      return [];
    }

    const ref = collection(db, `users/${session.user.id}/tasks`).withConverter(this.todoConverter);
    const queryObj = category ? query(ref, where("category", "==", category)) : ref;
    const tasks = await getDocs(queryObj).then((snapshot) =>
      snapshot.docs.map((doc) => {
        return doc.data();
      })
    );

    return tasks;
  }

  async getTaskById(id: string): Promise<Todo | null> {
    const session = await auth();
    if (!session?.user) {
      return null;
    }

    const taskRef = doc(db, `users/${session.user.id}/tasks`, id).withConverter(this.todoConverter);
    const taskSnapshot = await getDoc(taskRef);

    if (taskSnapshot.exists()) {
      return taskSnapshot.data();
    } else {
      return null;
    }
  }

  // async getTasksByCategory(category: string): Promise<Array<Todo>> {
  //   const session = await auth();
  //   if (!session?.user) {
  //     return [];
  //   }
    
  //   try {
  //     const ref = collection(db, `users/${session.user.id}/tasks`).withConverter(this.todoConverter);
  //     const q = query(ref, where("category", "==", category));
  //     const taskSnapshot = await getDocs(q).then((snapshot) => 
  //       snapshot.docs.map((doc) => {
  //         return doc.data();
  //       })
  //     );
  
  //     return taskSnapshot;
  //   } catch {
  //     return [];
  //   }

  // }

  async createTask(todo: Todo): Promise<string> {
    const session = await auth();
    if (!session?.user) {
      return "";
    }

    try {
      const ref = collection(db, `users/${session.user.id}/tasks`).withConverter(this.todoConverter);
      const newTask = await addDoc(ref, { ...todo, createdAt: Date.now() });
      return newTask.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return "";
    }
  }

  async updateTask(todo: Todo): Promise<boolean> {
    const session = await auth();
    if (!session?.user) {
      return false;
    }

    try {
      const ref = doc(db, `users/${session.user.id}/tasks`, todo.id).withConverter(this.todoConverter);

      await updateDoc(ref, {
        text: todo.text,
        completed: todo.completed,
        category: todo.category,
        note: todo.note,
        updatedAt: Date.now(),
      });

      return true;
    } catch (error) {
      console.error("Error updating document: ", error);
      return false;
    }
  }

  async deleteTask(id: string): Promise<void> {
    const session = await auth();
    if (!session?.user) {
      return;
    }

    try {
      const ref = doc(db, `users/${session.user.id}/tasks`, id).withConverter(this.todoConverter);
      await deleteDoc(ref);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  getCategories(): Promise<Array<string>> {
    throw new Error("Method not implemented.");
  }
  createCategory(newCategory: string): Promise<Array<string>> {
    throw new Error("Method not implemented.");
  }
  deleteCategory(category: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}