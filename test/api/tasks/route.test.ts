import { GET } from '@/app/api/tasks/route';
import { sampleTodos } from '@/app/lib/models/sampledata';
import { Todo } from '@/app/lib/models/todoItem';

const endpoint = 'http://localhost/api/tasks';

// Mock dependencies
jest.mock('@/app/lib/auth', () => {
  return {
    auth: jest.fn(),
  };
});
jest.mock('next/server', () => {
  return {
    NextRequest: jest.fn().mockImplementation((uri: string) => ({
      nextUrl: {
        searchParams: {
          get: jest.fn(str => uri.split('?')[1]?.split('&').find(s => s.startsWith(str))?.split('=')[1]),
        },
      },
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
import { auth } from '@/app/lib/auth';
import { NextRequest } from 'next/server';

// Type-safe mock accessors
const mockedAuth = auth as jest.Mock;

describe('GET /api/task', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('for unauthenticated users', () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue(null); // No user session
    });

    it('should use demoRepository and return all tasks', async () => {
      const req = new NextRequest(endpoint);

      // Act
      const response = await GET(req);
      const tasks: Todo[] = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(tasks).toEqual(sampleTodos);
      expect(mockedAuth).toHaveBeenCalledTimes(1);
    });

    it('should filter tasks by category', async () => {
      // Arrange
      const category = '仕事';
      const filteredTasks = sampleTodos.filter(t => t.category === category);
      const req = new NextRequest(`${endpoint}?category=${category}`);

      // Act
      const response = await GET(req);
      const tasks: Todo[] = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(tasks).toEqual(filteredTasks);



    });
  });

  describe('for authenticated users', () => {
    beforeEach(() => {
      mockedAuth.mockResolvedValue({ user: { id: 'test-user' } });
    });

    it('should use taskRepository and return all tasks', async () => {
      // Arrange

      const req = new NextRequest(endpoint);

      // Act
      const response = await GET(req);
      const tasks: Todo[] = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(tasks).toEqual(sampleTodos);



      expect(mockedAuth).toHaveBeenCalledTimes(1);
    });

    it('should filter tasks by category', async () => {
      // Arrange
      const category = '仕事';
      const filteredTasks = sampleTodos.filter(t => t.category === category);
      const req = new NextRequest(`${endpoint}?category=${category}`);

      // Act
      const response = await GET(req);
      const tasks: Todo[] = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(tasks).toEqual(filteredTasks);
    });
  });
});