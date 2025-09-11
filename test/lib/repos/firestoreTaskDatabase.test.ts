import FirestoreTaskDatabase from '@/app/lib/repos/firestoreTaskDatabase';
import { Todo } from '@/app/lib/models/todoItem';

// Mock the dependencies
jest.mock('@/app/lib/auth', () => {
  return {
    auth: jest.fn(),
    session: jest.fn(),
  };
});
jest.mock('@/app/lib/repos/firebase/firebase', () => ({
  __esModule: true,
  default: {}, // The 'db' object itself doesn't matter as we mock the functions that use it.
}));
jest.mock('firebase/firestore');
import { auth } from '@/app/lib/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

// Type-safe mock accessors
const mockedAuth = auth as jest.Mock;
const mockedAddDoc = addDoc as jest.Mock;
const mockedCollection = collection as jest.Mock;
const mockedDeleteDoc = deleteDoc as jest.Mock;
const mockedDoc = doc as jest.Mock;
const mockedGetDoc = getDoc as jest.Mock;
const mockedGetDocs = getDocs as jest.Mock;
const mockedQuery = query as jest.Mock;
const mockedUpdateDoc = updateDoc as jest.Mock;
const mockedWhere = where as jest.Mock;

const MOCK_USER_ID = 'test-user-id';
const MOCK_SESSION = { user: { id: MOCK_USER_ID } };

const sampleTodos: Todo[] = [
  { id: '1', text: 'Task 1', completed: false, category: 'A', note: '', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '2', text: 'Task 2', completed: true, category: 'B', note: '', createdAt: Date.now(), updatedAt: Date.now() },
];

describe('FirestoreTaskDatabase', () => {
  let db: FirestoreTaskDatabase;

  beforeEach(() => {
    db = new FirestoreTaskDatabase();
    jest.clearAllMocks();
    // Mock the builder functions to return a dummy object that can be chained with `withConverter`
    const mockRef = { withConverter: () => mockRef };
    mockedCollection.mockReturnValue(mockRef);
    mockedDoc.mockReturnValue(mockRef);
    mockedQuery.mockReturnValue(mockRef);
    mockedWhere.mockReturnValue(mockRef);
  });

  describe('unauthenticated access', () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue(null);
    });

    it('getTasks should return an empty array', async () => {
      try {
        const tasks = await db.getTasks();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      } finally {
        expect(mockedCollection).not.toHaveBeenCalled();
        expect(mockedGetDocs).not.toHaveBeenCalled();
        expect.assertions(3);
      }
    });

    it('getTaskById should return null', async () => {
      try {
        const task = await db.getTaskById('1');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      } finally {
        expect(mockedDoc).not.toHaveBeenCalled();
        expect(mockedGetDoc).not.toHaveBeenCalled();
        expect.assertions(3);
      }
    });

    it('createTask should return an empty string', async () => {
      try {
        const newId = await db.createTask(sampleTodos[0]);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      } finally {
        expect(mockedCollection).not.toHaveBeenCalled();
        expect(mockedAddDoc).not.toHaveBeenCalled();
        expect.assertions(3);
      }
    });

    it('updateTask should return false', async () => {
      try {
        const result = await db.updateTask(sampleTodos[0]);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      } finally {
        expect(mockedDoc).not.toHaveBeenCalled();
        expect(mockedUpdateDoc).not.toHaveBeenCalled();
        expect.assertions(3);
      }
    });

    it('deleteTask should do nothing', async () => {
      try {
        await db.deleteTask('1');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      } finally {
        expect(mockedDoc).not.toHaveBeenCalled();
        expect(mockedDeleteDoc).not.toHaveBeenCalled();
        expect.assertions(3);
      }
    });
  });

  describe('authenticated access', () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue(MOCK_SESSION);
    });

    describe('getTasks', () => {
      it('should fetch all tasks for a user', async () => {
        const mockDocs = sampleTodos.map(todo => ({ data: () => todo }));
        mockedGetDocs.mockResolvedValue({ docs: mockDocs });

        const tasks = await db.getTasks();

        expect(tasks).toEqual(sampleTodos);
        expect(mockedCollection).toHaveBeenCalledWith(expect.anything(), `users/${MOCK_USER_ID}/tasks`);
        expect(mockedQuery).not.toHaveBeenCalled();
        expect(mockedGetDocs).toHaveBeenCalled();
      });

      it('should fetch tasks filtered by category', async () => {
        const category = 'A';
        const filteredTodos = sampleTodos.filter(t => t.category === category);
        const mockDocs = filteredTodos.map(todo => ({ data: () => todo }));
        mockedGetDocs.mockResolvedValue({ docs: mockDocs });

        const tasks = await db.getTasks(category);

        expect(tasks).toEqual(filteredTodos);
        expect(mockedCollection).toHaveBeenCalledWith(expect.anything(), `users/${MOCK_USER_ID}/tasks`);
        expect(mockedWhere).toHaveBeenCalledWith("category", "==", category);
        expect(mockedQuery).toHaveBeenCalled();
        expect(mockedGetDocs).toHaveBeenCalled();
      });
    });

    describe('getTaskById', () => {
      it('should return a task if found', async () => {
        mockedGetDoc.mockResolvedValue({ exists: () => true, data: () => sampleTodos[0] });

        const task = await db.getTaskById('1');

        expect(task).toEqual(sampleTodos[0]);
        expect(mockedDoc).toHaveBeenCalledWith(expect.anything(), `users/${MOCK_USER_ID}/tasks`, '1');
        expect(mockedGetDoc).toHaveBeenCalled();
      });

      it('should return null if task is not found', async () => {
        mockedGetDoc.mockResolvedValue({ exists: () => false, data: () => null });

        const task = await db.getTaskById('non-existent');

        expect(task).toBeNull();
        expect(mockedDoc).toHaveBeenCalledWith(expect.anything(), `users/${MOCK_USER_ID}/tasks`, 'non-existent');
      });
    });

    describe('createTask', () => {
      it('should create a task and return its new ID', async () => {
        const newId = 'new-task-id';
        mockedAddDoc.mockResolvedValue({ id: newId });

        const result = await db.createTask(sampleTodos[0]);

        expect(result).toBe(newId);
        expect(mockedCollection).toHaveBeenCalledWith(expect.anything(), `users/${MOCK_USER_ID}/tasks`);
        expect(mockedAddDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
          ...sampleTodos[0],
          createdAt: expect.any(Number),
        }));
      });

      it('should return an empty string on error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockedAddDoc.mockRejectedValue(new Error('Firestore error'));

        const result = await db.createTask(sampleTodos[0]);

        expect(result).toBe('');
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error adding document: ", expect.any(Error));
        consoleErrorSpy.mockRestore();
      });
    });

    describe('updateTask', () => {
      it('should update a task and return true', async () => {
        mockedUpdateDoc.mockResolvedValue(undefined);
        const taskToUpdate = { ...sampleTodos[0], text: 'Updated Text' };

        const result = await db.updateTask(taskToUpdate);

        expect(result).toBe(true);
        expect(mockedDoc).toHaveBeenCalledWith(expect.anything(), `users/${MOCK_USER_ID}/tasks`, taskToUpdate.id);
        expect(mockedUpdateDoc).toHaveBeenCalledWith(expect.anything(), {
          text: taskToUpdate.text,
          completed: taskToUpdate.completed,
          category: taskToUpdate.category,
          note: taskToUpdate.note,
          updatedAt: expect.any(Number),
        });
      });

      it('should return false on error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockedUpdateDoc.mockRejectedValue(new Error('Firestore error'));

        const result = await db.updateTask(sampleTodos[0]);

        expect(result).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating document: ", expect.any(Error));
        consoleErrorSpy.mockRestore();
      });
    });

    describe('deleteTask', () => {
      it('should delete a task', async () => {
        mockedDeleteDoc.mockResolvedValue(undefined);
        await db.deleteTask('1');
        expect(mockedDoc).toHaveBeenCalledWith(expect.anything(), `users/${MOCK_USER_ID}/tasks`, '1');
        expect(mockedDeleteDoc).toHaveBeenCalled();
      });

      it('should log an error if deletion fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockedDeleteDoc.mockRejectedValue(new Error('Firestore error'));
        await db.deleteTask('1');
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error deleting document: ", expect.any(Error));
        consoleErrorSpy.mockRestore();
      });
    });
  });
});