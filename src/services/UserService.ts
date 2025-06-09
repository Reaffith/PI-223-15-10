import 'reflect-metadata';
import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { IUserService } from "../interfaces/service-interfaces/user-service.interface";
import { UserAttributes } from "../models/entities/User.model";
import { RolesEnum } from "../enums/RolesEnum";
import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";

@injectable( )
export class UserService implements IUserService {
  constructor(@inject('UnitOfWork') private uow: IUnitOfWork) {}

  async getAllUsers(): Promise<UserAttributes[]> {
      return await this.uow.getUserRepository().findAll();
  }

  async getUserById(id: number) {
    return await this.uow.getUserRepository().findById(id);
  }

  async getUserByEmail(email: string) {
    return await this.uow.getUserRepository().findByEmail(email);
  }

  async createUser(email: string, password: string, role: RolesEnum) {
    this.uow.beginTransaction();

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await this.uow.getUserRepository().create(
        {
          email,
          passwordHash,
          role,
        },
        this.uow.getTransaction()
      );

      await this.uow.commit();
      return user;
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }
  }

  async updateUser(
    id: number,
    data: Partial<{
      email?: string;
      password?: string;
      role?: RolesEnum;
    }>
  ) {
    this.uow.beginTransaction();

    try {
      let updateData: any = { ...data };
      if (data.password) {
        const passwordHash = await bcrypt.hash(data.password, 10);
        updateData = { ...updateData, passwordHash };
        delete updateData.password;
      }

      const [updatedCount] = await this.uow
        .getUserRepository()
        .update(id, updateData, this.uow.getTransaction());
      if (updatedCount === 0) {
        await this.uow.rollback();
        return null;
      }

      await this.uow.commit();
      return await this.getUserById(id);
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }
  }

async deleteUser(id: number): Promise<boolean> {
  await this.uow.beginTransaction();
  try {
    const deletedCount = await this.uow.getUserRepository().delete(id, this.uow.getTransaction());
    await this.uow.commit();
    return deletedCount > 0;
  } catch (error) {
    await this.uow.rollback();
    throw error;
  }
}

  async login(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
