import { getTasks } from "@/app/lib/actions/taskActions";
import { Todo } from "@/app/lib/models/todoItem";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<Array<Todo>>> {
  const targetCategory = req.nextUrl.searchParams.get('category');
  const tasks = await getTasks(targetCategory ?? undefined);
  return NextResponse.json(tasks);
}