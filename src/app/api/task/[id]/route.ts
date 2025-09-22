import { deleteTask, getTaskById, updateTask } from "@/app/lib/actions/taskActions";
import { Todo } from "@/app/lib/models/todoItem";
import { NextRequest, NextResponse } from "next/server";

type RequestParams = {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<RequestParams>}) {
  const { id } = await params;
  if (!id) throw Error('id is required');
  const task = await getTaskById(id);

  return new NextResponse(JSON.stringify(task), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<RequestParams> }) {
  const { id } = await params;
  const updateObj: Todo = await req.json();

  if (!id) throw Error('id is required');
  if (updateObj.id !== id) throw Error('id mismatch');
  
  if (await updateTask(updateObj)) {
    return new NextResponse(null, { status: 201 });
  } else {
    throw Error('update failed');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<RequestParams> }) {
  const { id } = await params;
  if (!id) throw Error('id is required');

  await deleteTask(id);
  return new NextResponse(null, { status: 204 });
}
