import { Transaction } from 'sequelize';
import { UserAttributes } from '../../models/entities/User.model';

export interface IUserRepository {
  findAll(): Promise<UserAttributes[]>;
  findById(id: number, transaction?: Transaction): Promise<UserAttributes | null>;
  findByEmail(email: string, transaction?: Transaction): Promise<UserAttributes | null>;
  create(data: UserAttributes, transaction?: Transaction): Promise<UserAttributes>;
  update(id: number, data: Partial<UserAttributes>, transaction?: Transaction): Promise<number[]>;
  delete(id: number, transaction?: Transaction): Promise<number>;
}