import { Todo } from "@/app/lib/models/todoItem";
import { taskRepository } from "@/app/lib/repos/taskRepository";
import { NextRequest, NextResponse } from "next/server";

type RequestParams = {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: RequestParams }) {
  if (!params.id) throw Error('id is required');
  const task = await taskRepository.getTaskById(params.id);

  return new NextResponse(JSON.stringify(task), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: RequestParams }) {
  const updateObj: Todo = await req.json();

  if (!params.id) throw Error('id is required');
  if (updateObj.id !== params.id) throw Error('id mismatch');
  
  if (await taskRepository.updateTask(updateObj)) {
    return new NextResponse(null, { status: 201 });
  } else {
    throw Error('update failed');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: RequestParams }) {
  if (!params.id) throw Error('id is required');

  await taskRepository.deleteTask(params.id);
  return new NextResponse(null, { status: 204 });
}
