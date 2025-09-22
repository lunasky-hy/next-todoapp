'use server'

import { getTaskRepository } from "@/app/lib/repos/taskRepository";

export async function getCategories(isDemo: boolean = false) {
  const repos = await getTaskRepository(isDemo);
  return await repos.getCategories();
}

export async function createCategory(newCategory: string, isDemo: boolean = false) {
  const repos = await getTaskRepository(isDemo);
  return await repos.createCategory(newCategory);
}

export async function deleteCategory(target: string, isDemo: boolean = false) {
  const repos = await getTaskRepository(isDemo);
  return await repos.deleteCategory(target);  
}

