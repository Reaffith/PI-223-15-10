import 'reflect-metadata';
import { DisciplineService } from '../services/DisciplineService';
import { DisciplineAttributes } from '../models/entities/Discipline.model';

const mockDisciplineRepository = {
  getAll: jest.fn(),
  findById: jest.fn(),
  findByTeacherId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockTeacherRepository = {
  findById: jest.fn(),
};

const mockTransaction = {} as any;

const mockUnitOfWork = {
  getDisciplineRepository: () => mockDisciplineRepository,
  getTeacherRepository: () => mockTeacherRepository,
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  getTransaction: () => mockTransaction,
};

describe('DisciplineService', () => {
  let service: DisciplineService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DisciplineService(mockUnitOfWork as any);
  });

  describe('getAllDisciplines', () => {
    it('should return all disciplines', async () => {
      // Arrange
      const disciplines: DisciplineAttributes[] = [{ id: 1, name: 'Math', teacherId: 10 }];
      mockDisciplineRepository.getAll.mockResolvedValue(disciplines);

      // Act
      const result = await service.getAllDisciplines();

      // Assert
      expect(result).toEqual(disciplines);
      expect(mockDisciplineRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDisciplineById', () => {
    it('should return a discipline by id', async () => {
      const discipline = { id: 1, name: 'Math', teacherId: 10 };
      mockDisciplineRepository.findById.mockResolvedValue(discipline);

      const result = await service.getDisciplineById(1);

      expect(result).toEqual(discipline);
      expect(mockDisciplineRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('getDisciplinesByTeacherId', () => {
    it('should return null if teacher not found', async () => {
      mockTeacherRepository.findById.mockResolvedValue(null);

      const result = await service.getDisciplinesByTeacherId(1);

      expect(result).toBeNull();
    });

    it('should return disciplines if teacher exists', async () => {
      const disciplines = [{ id: 1, name: 'Math', teacherId: 10 }];
      mockTeacherRepository.findById.mockResolvedValue({ id: 10 });
      mockDisciplineRepository.findByTeacherId.mockResolvedValue(disciplines);

      const result = await service.getDisciplinesByTeacherId(10);

      expect(result).toEqual(disciplines);
      expect(mockDisciplineRepository.findByTeacherId).toHaveBeenCalledWith(10);
    });
  });

  describe('createDiscipline', () => {
    it('should return null if teacher not found', async () => {
      mockTeacherRepository.findById.mockResolvedValue(null);

      const result = await service.createDiscipline('Physics', 1);

      expect(result).toBeNull();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });

    it('should create discipline and commit', async () => {
      const createdDiscipline = { id: 2, name: 'Physics', teacherId: 1 };
      mockTeacherRepository.findById.mockResolvedValue({ id: 1 });
      mockDisciplineRepository.create.mockResolvedValue(createdDiscipline);

      const result = await service.createDiscipline('Physics', 1);

      expect(result).toEqual(createdDiscipline);
      expect(mockDisciplineRepository.create).toHaveBeenCalledWith(
        { name: 'Physics', teacherId: 1 },
        mockTransaction
      );
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should rollback and throw error on exception', async () => {
      mockTeacherRepository.findById.mockResolvedValue({ id: 1 });
      mockDisciplineRepository.create.mockRejectedValue(new Error('fail'));

      await expect(service.createDiscipline('Biology', 1)).rejects.toThrow();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });
  });

  describe('updateDiscipline', () => {
    it('should return null if update count is 0', async () => {
      mockDisciplineRepository.update.mockResolvedValue([0]);

      const result = await service.updateDiscipline(1, { name: 'Chemistry' });

      expect(result).toBeNull();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });

    it('should update discipline and return updated version', async () => {
      const updated = { id: 1, name: 'Chemistry', teacherId: 1 };
      mockDisciplineRepository.update.mockResolvedValue([1]);
      mockDisciplineRepository.findById.mockResolvedValue(updated);

      const result = await service.updateDiscipline(1, { name: 'Chemistry' });

      expect(result).toEqual(updated);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should rollback and throw on error', async () => {
      mockDisciplineRepository.update.mockRejectedValue(new Error());

      await expect(service.updateDiscipline(1, { name: 'Fail' })).rejects.toThrow();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });
  });

  describe('deleteDiscipline', () => {
    it('should return false if nothing deleted', async () => {
      mockDisciplineRepository.delete.mockResolvedValue(0);

      const result = await service.deleteDiscipline(1);

      expect(result).toBe(false);
    });

    it('should return true if discipline deleted', async () => {
      mockDisciplineRepository.delete.mockResolvedValue(1);

      const result = await service.deleteDiscipline(1);

      expect(result).toBe(true);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should rollback and throw on error', async () => {
      mockDisciplineRepository.delete.mockRejectedValue(new Error());

      await expect(service.deleteDiscipline(1)).rejects.toThrow();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });
  });
});
