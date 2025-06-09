import { Transaction } from "sequelize";
import { TeacherAttributes } from "../../models/entities/Teacher.model";

export interface ITeacherRepository {
    findAll(): Promise<TeacherAttributes[]>;
    findById(id: number, transaction?: Transaction): Promise<TeacherAttributes | null>;
    findByUserId(userId: number, transaction?: Transaction): Promise<TeacherAttributes | null>;
    create(data: TeacherAttributes, transaction?: Transaction): Promise<TeacherAttributes>;
    update(id: number, data: Partial<TeacherAttributes>, transaction?: Transaction): Promise<[number]>;
    delete(id: number, transaction?: Transaction): Promise<number>;
}