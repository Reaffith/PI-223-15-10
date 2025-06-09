import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { IDisciplineService } from "../interfaces/service-interfaces/discipline-service.interface";
import { DisciplineAttributes } from "../models/entities/Discipline.model";

@injectable()
export class DisciplineService implements IDisciplineService {
  constructor(@inject('UnitOfWork') private uow: IUnitOfWork) {}

  async getAllDisciplines(): Promise<DisciplineAttributes[]> {
    return await this.uow.getDisciplineRepository().getAll();
  }
  
  async getDisciplineById(id: number): Promise<DisciplineAttributes | null> {
    return await this.uow.getDisciplineRepository().findById(id);
  }

  async getDisciplinesByTeacherId(
    teacherId: number
  ): Promise<DisciplineAttributes[] | null> {
    const teacher = await this.uow.getTeacherRepository().findById(teacherId);

    if (!teacher) {
      return null;
    }

    return await this.uow.getDisciplineRepository().findByTeacherId(teacherId);
  }

  async createDiscipline(
    name: string,
    teacherId: number
  ): Promise<DisciplineAttributes | null> {
    await this.uow.beginTransaction();

    try {
      const teacher = await this.uow.getTeacherRepository().findById(teacherId);
      if (!teacher) {
        this.uow.rollback();
        return null;
      }

      const discipline = await this.uow
        .getDisciplineRepository()
        .create({ name, teacherId }, this.uow.getTransaction());

      await this.uow.commit();
      return discipline;
    } catch (error) {
      await this.uow.rollback();
      throw new Error();
    }
  }

  async updateDiscipline(
    id: number,
    data: Partial<DisciplineAttributes>
  ): Promise<DisciplineAttributes | null> {
    await this.uow.beginTransaction();

    try {
      const [updatedCount] = await this.uow
        .getDisciplineRepository()
        .update(id, data, this.uow.getTransaction());
      if (updatedCount === 0) {
        await this.uow.rollback();
        return null;
      }

      await this.uow.commit();

      return await this.uow.getDisciplineRepository().findById(id);
    } catch (error) {
      await this.uow.rollback();
      throw new Error();
    }
  }

  async deleteDiscipline(id: number): Promise<boolean> {
    await this.uow.beginTransaction();

    try {
      const result = await this.uow
        .getDisciplineRepository()
        .delete(id, this.uow.getTransaction());

      if (result === 0) {
        return false;
      }

      this.uow.commit();
      return true;
    } catch (error) {
      this.uow.rollback();
      throw new Error();
    }
  }
}
