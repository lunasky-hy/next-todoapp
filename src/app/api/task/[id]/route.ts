import { auth } from "@/app/lib/auth";
import { Todo } from "@/app/lib/models/todoItem";
import { demoRepository, taskRepository } from "@/app/lib/repos/taskRepository";
import { NextRequest, NextResponse } from "next/server";

type RequestParams = {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: RequestParams }) {
  const authInfo = await auth();
  const db = authInfo?.user ? taskRepository : demoRepository;

  if (!params.id) throw Error('id is required');
  const task = await db.getTaskById(params.id);

  return new NextResponse(JSON.stringify(task), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: RequestParams }) {
  const authInfo = await auth();
  const db = authInfo?.user ? taskRepository : demoRepository;

  const updateObj: Todo = await req.json();

  if (!params.id) throw Error('id is required');
  if (updateObj.id !== params.id) throw Error('id mismatch');
  
  if (await db.updateTask(updateObj)) {
    return new NextResponse(null, { status: 201 });
  } else {
    throw Error('update failed');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: RequestParams }) {
  const authInfo = await auth();
  const db = authInfo?.user ? taskRepository : demoRepository;

  if (!params.id) throw Error('id is required');

  await db.deleteTask(params.id);
  return new NextResponse(null, { status: 204 });
}
