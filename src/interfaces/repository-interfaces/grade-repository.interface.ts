import { Transaction } from "sequelize";
import { GradeAttributes } from "../../models/entities/Grade.model";

export interface IGradeRepository {
    findAll():Promise<GradeAttributes[]>;
    findById(id: number, transaction?: Transaction): Promise<GradeAttributes | null>;
    findByStudentId(studentId: number, transaction?: Transaction): Promise<GradeAttributes[]>;
    findByTeacherId(teacherId: number, transaction?: Transaction): Promise<GradeAttributes[]>;
    create(data: GradeAttributes, transaction?: Transaction): Promise<GradeAttributes>;
    update(id: number, data: Partial<GradeAttributes>, transaction?: Transaction): Promise<[number]>;
    delete(id: number, transaction?: Transaction): Promise<number>;
}