import { Transaction } from "sequelize";
import { StudentAttributes } from "../../models/entities/Student.model";

export interface IStudentRepository {
    findAll(): Promise<StudentAttributes[]>;
    findById(id: number, transaction?: Transaction): Promise<StudentAttributes | null>;
    findByUserId(userId: number, transaction?: Transaction): Promise<StudentAttributes | null>;
    create(data: StudentAttributes, transaction?: Transaction): Promise<StudentAttributes>;
    update(id: number, data: Partial<StudentAttributes>, transaction?: Transaction): Promise<[number]>;
    delete(id: number, transaction?: Transaction): Promise<number>;
    findByGroupId(groupId: number, transaction?: Transaction): Promise<StudentAttributes[]>;
}