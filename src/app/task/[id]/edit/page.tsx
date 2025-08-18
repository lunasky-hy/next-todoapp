export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const taskId = params.id;

  return <p>{taskId}の詳細画面</p>
}