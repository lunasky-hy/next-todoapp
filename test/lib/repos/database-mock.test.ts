import MockDatabase from '@/app/lib/repos/database-mock';
import { sampleCategories, sampleTodos } from '@/app/lib/models/sampledata';
import { Todo } from '@/app/lib/models/todoItem';

describe('MockDatabase', () => {
  let db: MockDatabase;

  beforeEach(() => {
    db = new MockDatabase();
  });

  it('should be initialized with sample data', async () => {
    const tasks = await db.getTasks();
    expect(tasks).toEqual(sampleTodos);
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const tasks = await db.getTasks();
      expect(tasks.length).toBe(sampleTodos.length);
      expect(tasks).toEqual(sampleTodos);
    });
  });

  describe('getTaskById', () => {
    it('should return a task if found', async () => {
      const task = await db.getTaskById('1');
      expect(task).not.toBeNull();
      expect(task?.id).toBe('1');
      expect(task?.text).toBe('Next.jsのプロジェクトをセットアップする');
    });

    it('should return null if task is not found', async () => {
      const task = await db.getTaskById('non-existent-id');
      expect(task).toBeNull();
    });
  });

  describe('getTasksByCategory', () => {
    it('should return tasks for a given category', async () => {
      const category = '仕事';
      const tasks = await db.getTasksByCategory(category);
      const expectedTasks = sampleTodos.filter(t => t.category === category);
      expect(tasks.length).toBe(expectedTasks.length);
      expect(tasks).toEqual(expect.arrayContaining(expectedTasks));
    });

    it('should return an empty array for a category with no tasks', async () => {
      const tasks = await db.getTasksByCategory('non-existent-category');
      expect(tasks).toEqual([]);
    });
  });

  describe('createTask', () => {
    it('should add a new task and return its id', async () => {
      const newTask: Omit<Todo, 'id'> = {
        text: 'Write unit tests',
        completed: false,
        category: '仕事',
      };
      const newId = await db.createTask(newTask as Todo); // Casting because id is missing
      expect(newId).not.toBe('');

      const tasks = await db.getTasks();
      expect(tasks.length).toBe(sampleTodos.length + 1);

      const addedTask = await db.getTaskById(newId);
      expect(addedTask).not.toBeNull();
      expect(addedTask?.text).toBe(newTask.text);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task and return true', async () => {
      const taskToUpdate = { ...sampleTodos[0], completed: !sampleTodos[0].completed, text: 'Updated Text' };
      const result = await db.updateTask(taskToUpdate);
      expect(result).toBe(true);

      const updatedTask = await db.getTaskById(taskToUpdate.id);
      expect(updatedTask).toEqual(taskToUpdate);
    });

    it('should return false if task to update is not found', async () => {
      const nonExistentTask: Todo = {
        id: 'non-existent-id',
        text: 'Does not exist',
        completed: false,
      };
      const result = await db.updateTask(nonExistentTask);
      expect(result).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      const idToDelete = '1';
      const initialTasks = await db.getTasks();
      expect(initialTasks.find(t => t.id === idToDelete)).toBeDefined();

      await db.deleteTask(idToDelete);

      const finalTasks = await db.getTasks();
      expect(finalTasks.length).toBe(initialTasks.length - 1);
      expect(finalTasks.find(t => t.id === idToDelete)).toBeUndefined();
    });

    it('should not fail when deleting a non-existent task', async () => {
        const idToDelete = 'non-existent-id';
        const initialTasks = await db.getTasks();
        
        await db.deleteTask(idToDelete);
        
        const finalTasks = await db.getTasks();
        expect(finalTasks.length).toBe(initialTasks.length);
    });
  });

  describe('getCategories', () => {
    it('should return a unique list of categories from todos', async () => {
      const categories = await db.getCategories();
      const expectedCategories = [...sampleCategories];
      
      // sort both to ensure order doesn't matter for comparison
      categories.sort();
      expectedCategories.sort();

      expect(categories).toEqual(expectedCategories);
    });
  });

  describe('createCategory', () => {
    it('should add a new category', async () => {
      const newCategory = '新しいカテゴリ';
      await db.createCategory(newCategory);
      const expectedCategories = [...sampleCategories, newCategory];
      
      const categories = await db.getCategories();
      expect(categories).toEqual(expectedCategories);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const categoryToDelete = '趣味';
      await db.deleteCategory(categoryToDelete);
      const expectedCategories = sampleCategories.filter(c => c !== categoryToDelete);
      
      const categories = [...await db.getCategories()];
      expect(categories).toEqual(expectedCategories);
    });

    it('should not fail when deleting a non-existent category', async () => {
      const nonExistentCategory = 'non-existent-category';
      await db.deleteCategory(nonExistentCategory);

      const categories = await db.getCategories();
      expect(categories).not.toContain(nonExistentCategory);
    });

    it('should not delete a category if it has tasks', async () => {
      const categoryWithTasks = 'プライベート';
      try {
        await db.deleteCategory(categoryWithTasks);
      } catch (error) { 
        expect(error).toBeInstanceOf(Error);
      } finally {
        expect.assertions(1);
      }
    });
  });
});

