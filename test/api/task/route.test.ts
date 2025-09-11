import { POST } from '@/app/api/task/route';
import { Todo } from '@/app/lib/models/todoItem';

const endpoint = 'http://localhost/api/task';

// Mock dependencies
jest.mock('@/app/lib/auth', () => {
  return {
    auth: jest.fn(),
  }
});
jest.mock('@/app/lib/repos/taskRepository', () => ({
  __esModule: true, // This is important for ES modules
  taskRepository: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
  },
  demoRepository: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
  },
}));
jest.mock('next/server', () => {
  return {
    NextRequest: jest.fn().mockImplementation((uri, { method, body }) => ({
      json: jest.fn(() => Promise.resolve(JSON.parse(body))),
    })),
    NextResponse: {
      json: jest.fn((body, init) => {
        // NextResponse.jsonが呼ばれたら、
        // テストで検証可能なシンプルなオブジェクトを返すようにする
        return {
          status: init?.status || 200,
          json: () => Promise.resolve(body), // .json()で中身を取り出せるように
        };
      }),
    },
  };
});
import { NextRequest } from 'next/server';
import { auth } from '@/app/lib/auth';
import { demoRepository, taskRepository } from '@/app/lib/repos/taskRepository';

// Type-safe mock accessors
const mockedAuth = auth as jest.Mock;
const mockedTaskRepository = taskRepository as jest.Mocked<typeof taskRepository>;
const mockedDemoRepository = demoRepository as jest.Mocked<typeof demoRepository>;


describe('POST /api/task', () => {
  const newTodo: Todo = {
    id: 'client-id',
    text: 'New test task',
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

  describe('for unauthenticated users', () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue(null); // No user session
    });

    it('should use demoRepository to create a task and return the new ID', async () => {
      // Arrange
      const newTaskId = 'demo-task-123';
      mockedDemoRepository.createTask.mockResolvedValue(newTaskId);
      const req = new NextRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(newTodo),
      });

      // Act
      const response = await POST(req);
      const body = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(body).toEqual({ taskId: newTaskId });
      expect(mockedDemoRepository.createTask).toHaveBeenCalledWith(newTodo);
      expect(mockedDemoRepository.createTask).toHaveBeenCalledTimes(1);
      expect(mockedTaskRepository.createTask).not.toHaveBeenCalled();
      expect(mockedAuth).toHaveBeenCalledTimes(1);
    });
  });

  describe('for authenticated users', () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue({ user: { id: 'test-user' } });
    });

    it('should use taskRepository to create a task and return the new ID', async () => {
      // Arrange
      const newTaskId = 'real-task-456';
      mockedTaskRepository.createTask.mockResolvedValue(newTaskId);
      const req = new NextRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(newTodo),
      });

      // Act
      const response = await POST(req);
      const body = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(body).toEqual({ taskId: newTaskId });
      expect(mockedTaskRepository.createTask).toHaveBeenCalledWith(newTodo);
      expect(mockedTaskRepository.createTask).toHaveBeenCalledTimes(1);
      expect(mockedDemoRepository.createTask).not.toHaveBeenCalled();
      expect(mockedAuth).toHaveBeenCalledTimes(1);
    });
  });
});
