import { Transaction } from "sequelize";
import { IGradeRepository } from "../interfaces/repository-interfaces/grade-repository.interface";
import { Grade, GradeAttributes } from "../models/entities/Grade.model";
import { inject, injectable } from "tsyringe";

@injectable()
export class GradeRepository implements IGradeRepository{
    private gradeModel: typeof Grade;
    constructor() {
        this.gradeModel = Grade;
    }

    async findAll(): Promise<GradeAttributes[]> {
        return await this.gradeModel.findAll();
    }

    async findById(id: number, transaction?: Transaction): Promise<GradeAttributes | null> {
        return await this.gradeModel.findByPk(id, { transaction });
    }

    async findByStudentId(studentId: number, transaction?: Transaction): Promise<GradeAttributes[]> {
        return await this.gradeModel.findAll({ where: { studentId }, transaction });
    }
    async findByTeacherId(teacherId: number, transaction?: Transaction): Promise<GradeAttributes[]> {
        return await this.gradeModel.findAll({ where: { teacherId }, transaction });
    }
    async create(data: GradeAttributes, transaction?: Transaction): Promise<GradeAttributes> {
        return await this.gradeModel.create(data, { transaction });
    }
    async update(id: number, data: Partial<GradeAttributes>, transaction?: Transaction): Promise<[number]> {
        return await this.gradeModel.update(data, { where: { id }, transaction });
    }
    async delete(id: number, transaction?: Transaction): Promise<number> {
        return await this.gradeModel.destroy({ where: { id }, transaction });
    }
}