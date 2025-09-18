import { createTask } from "@/app/lib/actions/taskActions";
import { NextRequest, NextResponse } from "next/server";

type PostResponse = {
  taskId: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<PostResponse>> {  
  const body = await req.json();
  const newId = await createTask(body);

  return NextResponse.json({ taskId: newId });
}