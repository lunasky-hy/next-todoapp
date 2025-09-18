'use server';

import { Todo } from "@/app/lib/models/todoItem";
import { getTaskRepository } from "@/app/lib/repos/taskRepository";

export async function getTasks(category?: string, isDemo: boolean = false) {
  const repos = await getTaskRepository(isDemo);
  return await repos.getTasks(category);
}

export async function getTaskById(id: string, isDemo: boolean = false) {
  const repos = await getTaskRepository(isDemo);
  return await repos.getTaskById(id);
}

export async function createTask(newTodo: Todo, isDemo: boolean = false) {
  const repos = await getTaskRepository(isDemo);
  return await repos.createTask(newTodo);
}

export async function updateTask(todo: Todo, isDemo: boolean = false) {
  const repos = await getTaskRepository(isDemo);
  return await repos.updateTask(todo);
}

export async function deleteTask(id: string, isDemo: boolean = false) {
  const repos = await getTaskRepository(isDemo);
  return await repos.deleteTask(id);
}

export async function getCategories() {
  const repos = await getTaskRepository();
  return await repos.getCategories();  
}