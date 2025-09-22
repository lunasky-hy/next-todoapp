
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

  private userDataConverter: FirestoreDataConverter<Array<string>> = {
    toFirestore: (categories: Array<string>) => {
      return {
        categories: categories,
      };
    },
    fromFirestore: (
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions,
    ): Array<string> => {
      const data = snapshot.data(options);
      return data.categories;
    },
  }

  async getTasks(category?: string): Promise<Array<Todo>> {
    const sessionUser = await this.getUserId();

    const ref = collection(db, `users/${sessionUser}/tasks`).withConverter(this.todoConverter);
    const queryObj = category ? query(ref, where("category", "==", category)) : ref;
    const tasks = await getDocs(queryObj).then((snapshot) =>
      snapshot.docs.map((doc) => {
        return doc.data();
      })
    );

    return tasks;
  }

  async getTaskById(id: string): Promise<Todo | null> {
    const sessionUser = await this.getUserId();

    const taskRef = doc(db, `users/${sessionUser}/tasks`, id).withConverter(this.todoConverter);
    const taskSnapshot = await getDoc(taskRef);

    if (taskSnapshot.exists()) {
      return taskSnapshot.data();
    } else {
      return null;
    }
  }

  async createTask(todo: Todo): Promise<string> {
    const sessionUser = await this.getUserId();

    try {
      const ref = collection(db, `users/${sessionUser}/tasks`).withConverter(this.todoConverter);
      const newTask = await addDoc(ref, { ...todo, createdAt: Date.now() });
      return newTask.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return "";
    }
  }

  async updateTask(todo: Todo): Promise<boolean> {
    const sessionUser = await this.getUserId();

    try {
      const ref = doc(db, `users/${sessionUser}/tasks`, todo.id).withConverter(this.todoConverter);

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
    const sessionUser = await this.getUserId();

    try {
      const ref = doc(db, `users/${sessionUser}/tasks`, id).withConverter(this.todoConverter);
      await deleteDoc(ref);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  async getCategories(): Promise<Array<string>> {
    const sessionUser = await this.getUserId();

    try {
      const ref = doc(db, `users`, sessionUser).withConverter(this.userDataConverter);
      const docSnapshot = await getDoc(ref);
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error get categories document: ", error);
      return [];
    }
  }
  
  async createCategory(newCategory: string): Promise<Array<string>> {
    const sessionUser = await this.getUserId();

    const categories = await this.getCategories();
    if (categories.includes(newCategory)) throw Error('Cannot create same category');

    try {
      const updated = [...categories, newCategory];
      const ref = doc(db, `users`, sessionUser).withConverter(this.todoConverter);

      await updateDoc(ref, {
        categories: [...categories, newCategory],
      });

      return updated;
    } catch (error) {
      throw new Error('Operation Failed. create category');
    }
  }

  async deleteCategory(target: string): Promise<void> {
    const sessionUser = await this.getUserId();

    const categories = await this.getCategories();
    if (!categories.includes(target)) throw Error('Do not exist this category');

    try {
      const updated = categories.filter((cate) => cate !== target);
      const ref = doc(db, `users`, sessionUser).withConverter(this.todoConverter);

      await updateDoc(ref, {
        categories: updated,
      });
    } catch (error) {
      throw new Error('Operation Failed. create category');
    }
  }

  async getUserId(): Promise<string> {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");;
    }
    return session.user.id;
  }
}