import { taskRepository } from "@/app/lib/repos/taskRepository";
import { NextRequest, NextResponse } from "next/server";

type PostResponse = {
  taskId: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<PostResponse>> {  
  const body = await req.json();
  const newId = await taskRepository.createTask(body);

  return NextResponse.json({ taskId: newId });
}