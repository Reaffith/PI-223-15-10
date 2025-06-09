import 'reflect-metadata';
import { GroupService } from '../services/GroupService';

const mockGroupRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockTransaction = {} as any;
const mockUnitOfWork = {
  getGroupRepository: () => mockGroupRepository,
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  getTransaction: () => mockTransaction,
};

describe('GroupService', () => {
  let service: GroupService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new GroupService(mockUnitOfWork as any);
  });

  it('getAllGroups returns groups', async () => {
    const groups = [{ id: 1, name: 'A' }];
    mockGroupRepository.findAll.mockResolvedValue(groups);
    const result = await service.getAllGroups();
    expect(result).toEqual(groups);
  });

  it('createGroup creates and commits', async () => {
    mockGroupRepository.create.mockResolvedValue({ id: 1, name: 'A' });
    const result = await service.createGroup('A');
    expect(result).toEqual({ id: 1, name: 'A' });
    expect(mockUnitOfWork.commit).toHaveBeenCalled();
  });

  it('updateGroup returns null if not found', async () => {
    mockGroupRepository.findById.mockResolvedValue(null);
    const result = await service.updateGroup(1, 'B');
    expect(result).toBeNull();
    expect(mockUnitOfWork.rollback).toHaveBeenCalled();
  });

  it('deleteGroup returns false if not found', async () => {
    mockGroupRepository.findById.mockResolvedValue(null);
    const result = await service.deleteGroup(1);
    expect(result).toBe(false);
    expect(mockUnitOfWork.rollback).toHaveBeenCalled();
  });

  it('deleteGroup deletes and commits', async () => {
    mockGroupRepository.findById.mockResolvedValue({ id: 1, name: 'A' });
    mockGroupRepository.delete.mockResolvedValue(1);
    const result = await service.deleteGroup(1);
    expect(result).toBe(true);
    expect(mockUnitOfWork.commit).toHaveBeenCalled();
  });
});
