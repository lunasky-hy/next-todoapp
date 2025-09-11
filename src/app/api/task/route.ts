import { auth } from "@/app/lib/auth";
import { demoRepository, taskRepository } from "@/app/lib/repos/taskRepository";
import { NextRequest, NextResponse } from "next/server";

type PostResponse = {
  taskId: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<PostResponse>> {
  const authInfo = await auth();
  const db = authInfo?.user ? taskRepository : demoRepository;
  
  const body = await req.json();
  const newId = await db.createTask(body);

  return NextResponse.json({ taskId: newId });
}