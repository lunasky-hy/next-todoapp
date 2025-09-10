import { Todo } from "@/app/lib/models/todoItem";

// サンプルのToDoデータ
export const sampleTodos: Todo[] = [
  { id: '1', text: 'Next.jsのプロジェクトをセットアップする', note: "詳細", completed: true, category: '仕事' },
  { id: '2', text: 'Tailwind CSSを導入する', completed: true, category: '仕事' },
  { id: '3', text: 'React Hooksのドキュメントを読む', completed: false, category: '学習' },
  { id: '4', text: '買い物に行く', completed: false, category: 'プライベート' },
  { id: '5', text: '新しいToDoアプリのUIをデザインする', completed: false, category: '仕事' },
  { id: '6', text: '英語の単語を10個覚える', completed: true, category: '学習' },
];

export const sampleCategories: string[] = ['仕事', 'プライベート', '学習', '趣味'];