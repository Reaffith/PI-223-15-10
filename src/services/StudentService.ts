
import 'reflect-metadata'; 
import { IStudentService } from "../interfaces/service-interfaces/student-service.interface";
import { StudentAttributes } from "../models/entities/Student.model";
import { RolesEnum } from "../enums/RolesEnum";
import { UserService } from "./UserService";
import { inject, injectable } from "tsyringe";
import { UnitOfWork } from "../repositories/unit-of-work";

@injectable()
export class StudentService implements IStudentService {
  constructor(
    @inject("UnitOfWork") private uow: UnitOfWork,
    @inject("UserService") private userService: UserService
  ) {}
  
  async getAllStudents(): Promise<StudentAttributes[]> {
    return await this.uow.getStudentRepository().findAll();
  }

  async getStudentById(id: number): Promise<StudentAttributes | null> {
    return await this.uow.getStudentRepository().findById(id);
  }

  async getStudentByUserId(userId: number): Promise<StudentAttributes | null> {
    return await this.uow.getStudentRepository().findByUserId(userId);
  }

  async getStudentsByGroupId(groupId: number): Promise<StudentAttributes[]> {
    return await this.uow.getStudentRepository().findByGroupId(groupId);
  }

  async createStudent(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    groupId: number
  ): Promise<StudentAttributes | null> {
    await this.uow.beginTransaction();

    try {
      if (await this.userService.getUserByEmail(email)) {
        this.uow.rollback();
        return null;
      }

      const user = await this.userService.createUser(
        email,
        password,
        RolesEnum.STUDENT
      );

      const student = await this.uow.getStudentRepository().create(
        {
          firstName,
          lastName,
          groupId,
          userId: user.id!,
        },
        this.uow.getTransaction()
      );

      await this.uow.commit();
      return student;
    } catch (error) {
      await this.uow.rollback();
      throw new Error();
    }
  }

  async updateStudent(
    id: number,
    data: Partial<StudentAttributes>
  ): Promise<StudentAttributes | null> {
    await this.uow.beginTransaction();

    try {
      const [updatedCount] = await this.uow
        .getStudentRepository()
        .update(id, data, this.uow.getTransaction());

      if (updatedCount === 0) {
        await this.uow.rollback();
        return null;
      }

      await this.uow.commit();
      return await this.uow.getStudentRepository().findById(id);
    } catch (error) {
      await this.uow.rollback();
      throw new Error();
    }
  }

  async deleteStudent(id: number) {
    await this.uow.beginTransaction();

    try {
      const student = await this.uow.getStudentRepository().findById(id);

      if (!student) {
        await this.uow.rollback();
        return false;
      } else {
        await this.uow
          .getStudentRepository()
          .delete(id, this.uow.getTransaction());
        await this.uow
          .getUserRepository()
          .delete(student.userId, this.uow.getTransaction());

        await this.uow.commit();

        return true;
      }
    } catch (error) {
      await this.uow.rollback();
      throw new Error();
    }
  }
}
