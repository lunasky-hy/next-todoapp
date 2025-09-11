import { auth } from "@/app/lib/auth";
import { Todo } from "@/app/lib/models/todoItem";
import { demoRepository, taskRepository } from "@/app/lib/repos/taskRepository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<Array<Todo>>> {
  const authInfo = await auth();
  const db = authInfo?.user ? taskRepository : demoRepository;

  const targetCategory = req.nextUrl.searchParams.get('category');
  const tasks = await db.getTasks(targetCategory ?? undefined);
  return NextResponse.json(tasks);
}