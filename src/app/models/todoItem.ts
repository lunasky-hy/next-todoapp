
// ToDoアイテムの型定義
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  category: '仕事' | 'プライベート' | '学習';
};