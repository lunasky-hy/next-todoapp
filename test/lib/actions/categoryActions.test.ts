import { getTaskRepository } from '@/app/lib/repos/taskRepository';
import { createCategory, deleteCategory, getCategories } from '@/app/lib/actions/categoryActions';

// Mock the repository module
jest.mock('@/app/lib/repos/taskRepository', () => ({
  getTaskRepository: jest.fn(),
}));

const mockTaskRepository = {
  getCategories: jest.fn(),
  createCategory: jest.fn(),
  deleteCategory: jest.fn(),
};

// Cast the mocked module for type safety and to control its return value
const mockedGetTaskRepository = getTaskRepository as jest.Mock;

describe('categoryActions', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set the default mock implementation for getTaskRepository
    mockedGetTaskRepository.mockResolvedValue(mockTaskRepository);
  });

  describe('getCategory', () => {
    it('should get categories for a specific category', async () => {
      const mockCategory: string[] = ['Work', 'Personal', 'Shopping'];
      mockTaskRepository.getCategories.mockResolvedValue(mockCategory);

      const result = await getCategories(true);

      expect(mockedGetTaskRepository).toHaveBeenCalledWith(true);
      expect(mockTaskRepository.getCategories).toHaveBeenCalledWith();
      expect(result).toEqual(mockCategory);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const newCategory = 'new-category';
      mockTaskRepository.createCategory.mockResolvedValue(undefined);

      await createCategory(newCategory, true);

      expect(mockedGetTaskRepository).toHaveBeenCalledWith(true);
      expect(mockTaskRepository.createCategory).toHaveBeenCalledWith(newCategory);
    });
  });

  describe('deleteTask', () => {
    it('should delete a category', async () => {
      const removeTarget = 'delete-me';
      mockTaskRepository.deleteCategory.mockResolvedValue(undefined); // Assuming deleteTask returns void/undefined

      await deleteCategory(removeTarget, true);

      expect(mockedGetTaskRepository).toHaveBeenCalledWith(true);
      expect(mockTaskRepository.deleteCategory).toHaveBeenCalledWith(removeTarget);
    });
  });
});
