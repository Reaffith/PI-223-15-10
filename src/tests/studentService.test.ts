import 'reflect-metadata';
import { StudentService } from '../services/StudentService';
import { RolesEnum } from '../enums/RolesEnum';

const mockStudentRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findByGroupId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockUserRepository = {
  delete: jest.fn(),
};
const mockUserService = {
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
};
const mockTransaction = {} as any;
const mockUnitOfWork = {
  getStudentRepository: () => mockStudentRepository,
  getUserRepository: () => mockUserRepository,
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  getTransaction: () => mockTransaction,
};

describe('StudentService', () => {
  let service: StudentService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new StudentService(mockUnitOfWork as any, mockUserService as any);
  });

  it('getAllStudents returns students', async () => {
    const students = [{ id: 1 }];
    mockStudentRepository.findAll.mockResolvedValue(students);
    const result = await service.getAllStudents();
    expect(result).toEqual(students);
  });

  it('createStudent returns null if user exists', async () => {
    mockUserService.getUserByEmail.mockResolvedValue({});
    const result = await service.createStudent('a','b','c','d',1);
    expect(result).toBeNull();
    expect(mockUnitOfWork.rollback).toHaveBeenCalled();
  });

  it('createStudent creates and commits', async () => {
    mockUserService.getUserByEmail.mockResolvedValue(null);
    mockUserService.createUser.mockResolvedValue({ id: 2 });
    mockStudentRepository.create.mockResolvedValue({ id: 1 });
    const result = await service.createStudent('a','b','c','d',1);
    expect(result).toEqual({ id: 1 });
    expect(mockUnitOfWork.commit).toHaveBeenCalled();
  });

  it('deleteStudent returns false if not found', async () => {
    mockStudentRepository.findById.mockResolvedValue(null);
    const result = await service.deleteStudent(1);
    expect(result).toBe(false);
    expect(mockUnitOfWork.rollback).toHaveBeenCalled();
  });

  it('deleteStudent deletes and commits', async () => {
    mockStudentRepository.findById.mockResolvedValue({ userId: 2 });
    mockStudentRepository.delete.mockResolvedValue(1);
    mockUserRepository.delete.mockResolvedValue(1);
    const result = await service.deleteStudent(1);
    expect(result).toBe(true);
    expect(mockUnitOfWork.commit).toHaveBeenCalled();
  });
});
