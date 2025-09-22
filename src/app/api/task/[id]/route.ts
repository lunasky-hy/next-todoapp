import { deleteTask, getTaskById, updateTask } from "@/app/lib/actions/taskActions";
import { Todo } from "@/app/lib/models/todoItem";
import { NextRequest, NextResponse } from "next/server";

type RequestParams = {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: RequestParams }) {
  if (!params.id) throw Error('id is required');
  const task = await getTaskById(params.id);

  return new NextResponse(JSON.stringify(task), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: RequestParams }) {
  const updateObj: Todo = await req.json();

  if (!params.id) throw Error('id is required');
  if (updateObj.id !== params.id) throw Error('id mismatch');
  
  if (await updateTask(updateObj)) {
    return new NextResponse(null, { status: 201 });
  } else {
    throw Error('update failed');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: RequestParams }) {
  if (!params.id) throw Error('id is required');

  await deleteTask(params.id);
  return new NextResponse(null, { status: 204 });
}
