import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { IGradeService } from "../interfaces/service-interfaces/grade-service.interface";
import { GradeAttributes } from "../models/entities/Grade.model";

@injectable()
export class GradeService implements IGradeService {
  constructor(@inject('UnitOfWork') private uow: IUnitOfWork) {}

  async getAll(): Promise<GradeAttributes[]> {
    return await this.uow.getGradeRepository().findAll();
  }

  async getById(id: number): Promise<GradeAttributes | null> {
    return await this.uow.getGradeRepository().findById(id);
  }

  async getAllByStudentId(
    studentId: number
  ): Promise<GradeAttributes[] | null> {
    return await this.uow.getGradeRepository().findByStudentId(studentId);
  }

  async getAllByTeacherId(
    teacherId: number
  ): Promise<GradeAttributes[] | null> {
    return this.uow.getGradeRepository().findByTeacherId(teacherId);
  }

  async updateGrade(
    id: number,
    data: Partial<GradeAttributes>
  ): Promise<GradeAttributes | null> {
    const [updatedCount] = await this.uow.getGradeRepository().update(id, data);

    if (updatedCount < 1) {
      return null;
    }

    return await this.uow.getGradeRepository().findById(id);
  }

  async createGrade(data: GradeAttributes): Promise<GradeAttributes> {
    const newGrade = this.uow.getGradeRepository().create(data);

    return newGrade;
  }

  async deleteGrade(id: number): Promise<boolean> {
      const deletedCount = await this.uow.getGradeRepository().delete(id);

      return deletedCount > 0;
  }
}
