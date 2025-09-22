import { getTaskRepository } from '@/app/lib/repos/taskRepository';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '@/app/lib/actions/taskActions';
import { Todo } from '@/app/lib/models/todoItem';

// Mock the repository module
jest.mock('@/app/lib/repos/taskRepository', () => ({
  getTaskRepository: jest.fn(),
}));

const mockTaskRepository = {
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};

// Cast the mocked module for type safety and to control its return value
const mockedGetTaskRepository = getTaskRepository as jest.Mock;

describe('taskActions', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set the default mock implementation for getTaskRepository
    mockedGetTaskRepository.mockResolvedValue(mockTaskRepository);
  });

  describe('getTasks', () => {
    it('should get tasks for a specific category in demo mode', async () => {
      const mockTasks: Todo[] = [{ id: '1', text: 'Demo Task', completed: false }];
      mockTaskRepository.getTasks.mockResolvedValue(mockTasks);

      const result = await getTasks('demo-category', true);

      expect(mockedGetTaskRepository).toHaveBeenCalledWith(true);
      expect(mockTaskRepository.getTasks).toHaveBeenCalledWith('demo-category');
      expect(result).toEqual(mockTasks);
    });

    it('should get all tasks when no category is provided', async () => {
      await getTasks(undefined, false);
      expect(mockedGetTaskRepository).toHaveBeenCalledWith(false);
      expect(mockTaskRepository.getTasks).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getTaskById', () => {
    it('should get a task by its ID', async () => {
      const mockTask: Todo = { id: 'task-123', text: 'Find Me', completed: true };
      mockTaskRepository.getTaskById.mockResolvedValue(mockTask);

      const result = await getTaskById('task-123', false);

      expect(mockedGetTaskRepository).toHaveBeenCalledWith(false);
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith('task-123');
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const newTodo: Todo = { id: 'new-id', text: 'New Task', completed: false };
      const createdTask: Todo = { ...newTodo };
      mockTaskRepository.createTask.mockResolvedValue(createdTask);

      const result = await createTask(newTodo, true);

      expect(mockedGetTaskRepository).toHaveBeenCalledWith(true);
      expect(mockTaskRepository.createTask).toHaveBeenCalledWith(newTodo);
      expect(result).toEqual(createdTask);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const todoToUpdate: Todo = { id: 'update-me', text: 'Updated Title', completed: true };
      mockTaskRepository.updateTask.mockResolvedValue(todoToUpdate);

      const result = await updateTask(todoToUpdate, false);

      expect(mockedGetTaskRepository).toHaveBeenCalledWith(false);
      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(todoToUpdate);
      expect(result).toEqual(todoToUpdate);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by its ID', async () => {
      const taskId = 'delete-me';
      mockTaskRepository.deleteTask.mockResolvedValue(undefined); // Assuming deleteTask returns void/undefined

      await deleteTask(taskId, true);

      expect(mockedGetTaskRepository).toHaveBeenCalledWith(true);
      expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(taskId);
    });
  });
});
