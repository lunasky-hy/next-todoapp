import { GET, PUT, DELETE } from '@/app/api/task/[id]/route';
import { Todo } from '@/app/lib/models/todoItem';

const endpoint = 'http://localhost/api/task/1';

const mockTodo: Todo = {
  id: '1',
  text: 'Test Task',
  completed: false,
  category: 'Test',
  note: 'A note',
  createdAt: 123,
  updatedAt: 123,
};

// Mock dependencies
jest.mock('@/app/lib/auth', () => {
  return {
    auth: jest.fn(),
  }
});
jest.mock('@/app/lib/repos/taskRepository', () => ({
  __esModule: true, // This is important for ES modules
  getTaskRepository: jest.fn().mockReturnValue({})
}));
jest.mock('next/server', () => {
  return {
    NextRequest: jest.fn().mockImplementation((uri, { method, body }) => ({
      json: jest.fn(() => Promise.resolve(body ? JSON.parse(body) : {})),
    })),
    NextResponse: jest.fn().mockImplementation((body, { status }) => ({
      status: status,
      json: jest.fn(() => body ? JSON.parse(body): body),
    })),
  };
});
jest.mock('@/app/lib/actions/taskActions', () => {
  return {
    getTaskById: jest.fn((id: string) => Promise.resolve(mockTodo)),
    updateTask: jest.fn((todo: Todo) => Promise.resolve(todo)),
    deleteTask: jest.fn(),
  }
});

import { NextRequest } from 'next/server';
import { deleteTask, getTaskById, updateTask } from '@/app/lib/actions/taskActions';
import { getTaskRepository } from '@/app/lib/repos/taskRepository';

describe('GET /api/task/[id]', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('for authenticated users', () => {
    it('should use demoRepository to get a task by ID', async () => {
      // Arrange
      const req = new NextRequest(endpoint, { method: 'GET' });

      const response = await GET(req, { params: { id: '1' } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockTodo);
      expect(getTaskById).toHaveBeenCalledWith('1');
    })

    it('should use taskRepository to put a task', async () => {
      // Arrange
      // mockedTaskRepository.updateTask.mockResolvedValue(true);
      const req = new NextRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(mockTodo),
      });

      const response = await PUT(req, { params: { id: '1' } });

      expect(response.status).toBe(201);
      expect(updateTask).toHaveBeenCalledWith(mockTodo);
    });

    it('should use taskRepository to delete a task', async () => {
      // Arrange
      // mockedTaskRepository.deleteTask.mockResolvedValue();
      const req = new NextRequest(endpoint, { method: 'DELETE' });

      const response = await DELETE(req, { params: { id: '1' } });

      expect(response.status).toBe(204);
      expect(deleteTask).toHaveBeenCalledWith('1');
    });
  });
});