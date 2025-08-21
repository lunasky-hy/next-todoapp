'use server'

import db from "@/app/repos/firebase/firebase";
import { Todo } from "@/app/models/todoItem";
import { addDoc, collection, deleteDoc, doc, FirestoreDataConverter, getDoc, getDocs, QueryDocumentSnapshot, SnapshotOptions, updateDoc } from "firebase/firestore";

export interface TaskDatabase {
  createTask(todo: Todo): Promise<string>;
  getTasks(): Promise<Array<Todo>>;
  getTaskById(id: string): Promise<Todo | null>;
  updateTask(todo: Todo): Promise<boolean>;
  deleteTask(id: string): Promise<void>;
}

class FirestoreTaskDatabase implements TaskDatabase {
  private todoConverter: FirestoreDataConverter<Todo> = {
    toFirestore: (task: Todo) => {
      return {
        text: task.text,
        note: task.note,
        completed: task.completed,
        category: task.category,
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
      };
    },
  };

  private tasksCollection = collection(db, "tasks").withConverter(this.todoConverter);

  async createTask(todo: Todo): Promise<string> {
    try {
      const newTask = await addDoc(this.tasksCollection, todo);
      return newTask.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return "";
    }
  }

  async getTasks(): Promise<Array<Todo>> {
    const tasks = await getDocs(this.tasksCollection).then((snapshot) =>
      snapshot.docs.map((doc) => {
        return doc.data();
      })
    );

    return tasks;
  }

  async getTaskById(id: string): Promise<Todo | null> {
    const taskRef = doc(db, "tasks", id).withConverter(this.todoConverter);
    const taskSnapshot = await getDoc(taskRef);

    if (taskSnapshot.exists()) {
      return taskSnapshot.data();
    } else {
      return null;
    }
  }

  async updateTask(todo: Todo): Promise<boolean> {
    try {
      const taskRef = doc(db, "tasks", todo.id).withConverter(this.todoConverter);
      await updateDoc(taskRef, {
        text: todo.text,
        completed: todo.completed,
        category: todo.category,
        note: todo.note,
      });
      return true;
    } catch (error) {
      console.error("Error updating document: ", error);
      return false;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const taskRef = doc(db, "tasks", id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
}

const taskDatabase = new FirestoreTaskDatabase();

export async function getTasks(): Promise<Array<Todo>> {
  return taskDatabase.getTasks();
}

export async function getTaskById(id: string): Promise<Todo | null> {
  return taskDatabase.getTaskById(id);
}

export async function createTask(todo: Todo): Promise<string> {
  return taskDatabase.createTask(todo);
}

export async function updateTask(todo: Todo): Promise<boolean> {
  return taskDatabase.updateTask(todo);
}

export async function deleteTask(id: string): Promise<void> {
  return taskDatabase.deleteTask(id);
}