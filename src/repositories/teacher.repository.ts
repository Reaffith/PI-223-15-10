import { ModelStatic, Transaction } from "sequelize";
import { ITeacherRepository } from "../interfaces/repository-interfaces/teacher-repository.interface";
import { Teacher, TeacherAttributes, TeacherInstance } from "../models/entities/Teacher.model";
import { inject, injectable } from "tsyringe";

@injectable()
export class TeacherRepository implements ITeacherRepository {
    private teacherModel: ModelStatic<TeacherInstance>;
    constructor() {
        this.teacherModel = Teacher;
    }

    async findAll(): Promise<TeacherAttributes[]> {
        return await this.teacherModel.findAll();
    }

    async findById(id: number, transaction?: Transaction): Promise<TeacherAttributes | null> {
        return this.teacherModel.findByPk(id, { transaction });
    }

    async findByUserId(userId: number, transaction?: Transaction): Promise<TeacherAttributes | null> {
        return this.teacherModel.findOne({ where: { userId }, transaction });
    }

    async create(data: TeacherAttributes, transaction?: Transaction): Promise<TeacherAttributes> {
        return this.teacherModel.create(data, { transaction });
    }

    async update(id: number, data: Partial<TeacherAttributes>, transaction?: Transaction): Promise<[number]> {
        return this.teacherModel.update(data, { where: { id }, transaction });
    }

    async delete(id: number, transaction?: Transaction): Promise<number> {
        return this.teacherModel.destroy({ where: { id }, transaction });
    }
}