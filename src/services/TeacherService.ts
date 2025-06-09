import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { ITeacherService } from "../interfaces/service-interfaces/teacher-service.interface";
import { IUserService } from "../interfaces/service-interfaces/user-service.interface";
import { TeacherAttributes } from "../models/entities/Teacher.model";
import { RolesEnum } from "../enums/RolesEnum";
import { inject, injectable } from "tsyringe";

@injectable()
export class TeacherService implements ITeacherService {
  constructor(
    @inject("UnitOfWork") private uow: IUnitOfWork,
    @inject("UserService") private userService: IUserService
  ) {}

  async getAllTeachers(): Promise<TeacherAttributes[]> {
    return await this.uow.getTeacherRepository().findAll();
  }

  async getTeacherById(id: number): Promise<TeacherAttributes | null> {
    return await this.uow.getTeacherRepository().findById(id);
  }

  async getTeacherByUserId(userId: number): Promise<TeacherAttributes | null> {
    return await this.uow.getTeacherRepository().findByUserId(userId);
  }

  async updateTeacher(
    id: number,
    data: Partial<TeacherAttributes>
  ): Promise<TeacherAttributes | null> {
    await this.uow.beginTransaction();

    try {
      const [updatedCount] = await this.uow
        .getTeacherRepository()
        .update(id, data, this.uow.getTransaction());

      if (updatedCount === 0) {
        await this.uow.rollback();
        return null;
      }

      await this.uow.commit();

      return await this.uow.getTeacherRepository().findById(id);
    } catch (error) {
      await this.uow.rollback();
      throw new Error();
    }
  }

  async createTeacher(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<TeacherAttributes | null> {
    await this.uow.beginTransaction();

    try {
      if (await this.userService.getUserByEmail(email)) {
        await this.uow.rollback();

        return null;
      }

      const user = await this.userService.createUser(
        email,
        password,
        RolesEnum.TEACHER
      );

      const student = await this.uow.getTeacherRepository().create(
        {
          firstName,
          lastName,
          userId: user.id!,
        },
        this.uow.getTransaction()
      );

      await this.uow.commit();
      return student;
    } catch (error) {
      this.uow.rollback();
      throw new Error();
    }
  }

  async deleteTeacher(id: number): Promise<boolean> {
    await this.uow.beginTransaction();

    try {
      const teacher = await this.uow.getTeacherRepository().findById(id);

      if (!teacher) {
        await this.uow.rollback();
        return false;
      }

      await this.uow
        .getTeacherRepository()
        .delete(id, this.uow.getTransaction());
      await this.uow
        .getUserRepository()
        .delete(teacher.userId, this.uow.getTransaction());

      await this.uow.commit();
      return true;
    } catch (error) {
      await this.uow.rollback();
      throw new Error();
    }
  }
}
