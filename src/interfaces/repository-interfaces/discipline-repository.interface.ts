import { Transaction } from "sequelize";
import { DisciplineAttributes } from "../../models/entities/Discipline.model";

export interface IDisciplineRepository {
    getAll(): Promise<DisciplineAttributes[]>;
    findById(id: number, transaction?: Transaction): Promise<DisciplineAttributes | null>;
    findByTeacherId(teacherId: number, transaction?: Transaction): Promise<DisciplineAttributes[]>;
    create(data: DisciplineAttributes, transaction?: Transaction): Promise<DisciplineAttributes>;
    update(id: number, data: Partial<DisciplineAttributes>, transaction?: Transaction): Promise<[number]>;
    delete(id: number, transaction?: Transaction): Promise<number>;
}