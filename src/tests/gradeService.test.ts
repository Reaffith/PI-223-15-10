import 'reflect-metadata';
import { GradeService } from '../services/GradeService';

const mockGradeRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByStudentId: jest.fn(),
  findByTeacherId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockUnitOfWork = {
  getGradeRepository: () => mockGradeRepository,
};

describe('GradeService', () => {
  let service: GradeService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new GradeService(mockUnitOfWork as any);
  });

  it('getAll returns grades', async () => {
    const grades = [{ id: 1 }];
    mockGradeRepository.findAll.mockResolvedValue(grades);
    const result = await service.getAll();
    expect(result).toEqual(grades);
  });

  it('getById returns grade', async () => {
    mockGradeRepository.findById.mockResolvedValue({ id: 1 });
    const result = await service.getById(1);
    expect(result).toEqual({ id: 1 });
  });

  it('createGrade calls repository', async () => {
    mockGradeRepository.create.mockResolvedValue({ id: 1 });
    const result = await service.createGrade({ id: 1, studentId: 1, disciplineId: 1, teacherId: 1, value: 90 });
    expect(result).toEqual({ id: 1 });
  });

  it('updateGrade returns null if not updated', async () => {
    mockGradeRepository.update.mockResolvedValue([0]);
    const result = await service.updateGrade(1, { value: 80 });
    expect(result).toBeNull();
  });

  it('deleteGrade returns true if deleted', async () => {
    mockGradeRepository.delete.mockResolvedValue(1);
    const result = await service.deleteGrade(1);
    expect(result).toBe(true);
  });

  it('deleteGrade returns false if not deleted', async () => {
    mockGradeRepository.delete.mockResolvedValue(0);
    const result = await service.deleteGrade(1);
    expect(result).toBe(false);
  });
});
