// user.service.spec.ts

import 'reflect-metadata';
import { UserService } from '../services/UserService';
import { RolesEnum } from '../enums/RolesEnum';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockUserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockTransaction = {} as any;

const mockUnitOfWork = {
  getUserRepository: () => mockUserRepository,
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  getTransaction: () => mockTransaction,
};


describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService(mockUnitOfWork as any);
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Arrange
      const users = [{ id: 1, email: 'a', passwordHash: 'h', role: RolesEnum.STUDENT }];
      mockUserRepository.findAll.mockResolvedValue(users);

      // Act
      const result = await service.getAllUsers();

      // Assert
      expect(result).toEqual(users);
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      // Arrange
      const user = { id: 1, email: 'a', passwordHash: 'h', role: RolesEnum.STUDENT };
      mockUserRepository.findById.mockResolvedValue(user);

      // Act
      const result = await service.getUserById(1);

      // Assert
      expect(result).toEqual(user);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      // Arrange
      const user = { id: 1, email: 'a', passwordHash: 'h', role: RolesEnum.STUDENT };
      mockUserRepository.findByEmail.mockResolvedValue(user);

      // Act
      const result = await service.getUserByEmail('a');

      // Assert
      expect(result).toEqual(user);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('a');
    });
  });

  describe('createUser', () => {
    it('should create user and commit', async () => {
      // Arrange
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      const user = { id: 1, email: 'a', passwordHash: 'hashed', role: RolesEnum.STUDENT };
      mockUserRepository.create.mockResolvedValue(user);

      // Act
      const result = await service.createUser('a', 'p', RolesEnum.STUDENT);

      // Assert
      expect(result).toEqual(user);
      expect(bcrypt.hash).toHaveBeenCalledWith('p', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        { email: 'a', passwordHash: 'hashed', role: RolesEnum.STUDENT },
        mockTransaction
      );
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should rollback and throw on error', async () => {
      // Arrange
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockUserRepository.create.mockRejectedValue(new Error('fail'));

      // Act & Assert
      await expect(service.createUser('a', 'p', RolesEnum.STUDENT)).rejects.toThrow();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated version', async () => {
      // Arrange
      mockUserRepository.update.mockResolvedValue([1]);
      const updated = { id: 1, email: 'a', passwordHash: 'h', role: RolesEnum.STUDENT };
      mockUserRepository.findById.mockResolvedValue(updated);

      // Act
      const result = await service.updateUser(1, { email: 'a' });

      // Assert
      expect(result).toEqual(updated);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should hash password if provided', async () => {
      // Arrange
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockUserRepository.update.mockResolvedValue([1]);
      mockUserRepository.findById.mockResolvedValue({ id: 1, email: 'a', passwordHash: 'hashed', role: RolesEnum.STUDENT });

      // Act
      const result = await service.updateUser(1, { password: 'p' });

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('p', 10);
      expect(result).toEqual({ id: 1, email: 'a', passwordHash: 'hashed', role: RolesEnum.STUDENT });
    });

    it('should rollback and return null if update count is 0', async () => {
      // Arrange
      mockUserRepository.update.mockResolvedValue([0]);

      // Act
      const result = await service.updateUser(1, { email: 'a' });

      // Assert
      expect(result).toBeNull();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });

    it('should rollback and throw on error', async () => {
      // Arrange
      mockUserRepository.update.mockRejectedValue(new Error());

      // Act & Assert
      await expect(service.updateUser(1, { email: 'a' })).rejects.toThrow();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should return true if user deleted', async () => {
      // Arrange
      mockUserRepository.delete.mockResolvedValue(1);

      // Act
      const result = await service.deleteUser(1);

      // Assert
      expect(result).toBe(true);
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
    });

    it('should return false if nothing deleted', async () => {
      // Arrange
      mockUserRepository.delete.mockResolvedValue(0);

      // Act
      const result = await service.deleteUser(1);

      // Assert
      expect(result).toBe(false);
    });

    it('should rollback and throw on error', async () => {
      // Arrange
      mockUserRepository.delete.mockRejectedValue(new Error());

      // Act & Assert
      await expect(service.deleteUser(1)).rejects.toThrow();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return null if user not found', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.login('a', 'p');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: 'a', passwordHash: 'h', role: RolesEnum.STUDENT });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.login('a', 'wrong');

      // Assert
      expect(result).toBeNull();
    });

    it('should return user if password is valid', async () => {
      // Arrange
      const user = { id: 1, email: 'a', passwordHash: 'h', role: RolesEnum.STUDENT };
      mockUserRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.login('a', 'h');

      // Assert
      expect(result).toEqual(user);
    });
  });
});
