import { DisciplineAttributes } from "../../models/entities/Discipline.model";

export interface IDisciplineService {
  getAllDisciplines(): Promise<DisciplineAttributes[]>
  getDisciplineById(id: number): Promise<DisciplineAttributes | null>;
  getDisciplinesByTeacherId(teacherId: number): Promise<DisciplineAttributes[] | null>;
  createDiscipline(name: string, teacherId: number): Promise<DisciplineAttributes | null>;
  updateDiscipline(
    id: number,
    data: Partial<DisciplineAttributes>
  ): Promise<DisciplineAttributes | null>;
  deleteDiscipline(id: number): Promise<boolean>;
}
