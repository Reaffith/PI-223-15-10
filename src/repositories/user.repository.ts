import { ModelStatic, Transaction } from "sequelize";
import {
  UserInstance,
  UserAttributes,
  User,
} from "../models/entities/User.model";
import { IUserRepository } from "../interfaces/repository-interfaces/user-repository.interface";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository implements IUserRepository {
  private userModel: ModelStatic<UserInstance>;
  constructor() {
    this.userModel = User;
  }

  async findAll(): Promise<UserAttributes[]> {
    return await this.userModel.findAll();
  }

  async findById(
    id: number,
    transaction?: Transaction
  ): Promise<UserAttributes | null> {
    return await this.userModel.findByPk(id, { transaction });
  }

  async findByEmail(
    email: string,
    transaction?: Transaction
  ): Promise<UserAttributes | null> {
    return await this.userModel.findOne({ where: { email }, transaction });
  }

  async create(
    data: UserAttributes,
    transaction?: Transaction
  ): Promise<UserAttributes> {
    return await this.userModel.create(data, { transaction });
  }

  async update(
    id: number,
    data: Partial<UserAttributes>,
    transaction?: Transaction
  ): Promise<[number]> {
    return await this.userModel.update(data, { where: { id }, transaction });
  }

  async delete(id: number, transaction?: Transaction): Promise<number> {
    return await this.userModel.destroy({ where: { id }, transaction });
  }
}
