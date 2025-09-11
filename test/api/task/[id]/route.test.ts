import { GET, PUT, DELETE } from '@/app/api/task/[id]/route';
import { Todo } from '@/app/lib/models/todoItem';

const endpoint = 'http://localhost/api/task/1';

// Mock dependencies
jest.mock('@/app/lib/auth', () => {
  return {
    auth: jest.fn(),
  }
});
jest.mock('@/app/lib/repos/taskRepository', () => ({
  __esModule: true, // This is important for ES modules
  taskRepository: {
    getTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  demoRepository: {
    getTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));
jest.mock('next/server', () => {
  return {
    NextRequest: jest.fn().mockImplementation((uri, { method, body }) => ({
      json: jest.fn(() => Promise.resolve(body ? JSON.parse(body) : {})),
    })),
    NextResponse: jest.fn().mockImplementation((body, { status }) => ({
      status: status,
      json: jest.fn(() => JSON.parse(body)),
    })),
  };
});
import { NextRequest } from 'next/server';
import { auth } from '@/app/lib/auth';
import { taskRepository } from '@/app/lib/repos/taskRepository';

// Type-safe mock accessors
const mockedAuth = auth as jest.Mock;
const mockedTaskRepository = taskRepository as jest.Mocked<typeof taskRepository>;

describe('GET /api/task/[id]', () => {
  const mockTodo: Todo = {
    id: '1',
    text: 'Test Task',
    completed: false,
    category: 'Test',
    note: 'A note',
    createdAt: 123,
    updatedAt: 123,
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('for authenticated users', () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue({ user: { id: 'test-user' }}); // No user session
    });

    it('should use demoRepository to get a task by ID', async () => {
      // Arrange
      mockedTaskRepository.getTaskById.mockResolvedValue(mockTodo);
      const req = new NextRequest(endpoint, { method: 'GET' });

      const response = await GET(req, { params: { id: '1' } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockTodo);
      expect(mockedTaskRepository.getTaskById).toHaveBeenCalledWith('1');
    })

    it('should use taskRepository to put a task', async () => {
      // Arrange
      mockedTaskRepository.updateTask.mockResolvedValue(true);
      const req = new NextRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(mockTodo),
      });

      const response = await PUT(req, { params: { id: '1' } });

      expect(response.status).toBe(201);
      expect(mockedTaskRepository.updateTask).toHaveBeenCalledWith(mockTodo);
    });

    it('should use taskRepository to delete a task', async () => {
      // Arrange
      mockedTaskRepository.deleteTask.mockResolvedValue();
      const req = new NextRequest(endpoint, { method: 'DELETE' });

      const response = await DELETE(req, { params: { id: '1' } });

      expect(response.status).toBe(204);
      expect(mockedTaskRepository.deleteTask).toHaveBeenCalledWith('1');
    });
  });

});