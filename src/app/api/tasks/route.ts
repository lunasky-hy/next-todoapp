import { Todo } from "@/app/lib/models/todoItem";
import { taskRepository } from "@/app/lib/repos/taskRepository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<Array<Todo>>> {
  const targetCategory = req.nextUrl.searchParams.get('category');
  const tasks = await taskRepository.getTasks(targetCategory ?? undefined);
  return NextResponse.json(tasks);
}