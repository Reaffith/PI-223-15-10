import { ModelStatic, Transaction } from "sequelize";
import { IStudentRepository } from "../interfaces/repository-interfaces/student-repository.interface";
import { Student, StudentAttributes, StudentInstance } from "../models/entities/Student.model";
import { inject, injectable } from "tsyringe";

@injectable()
export class StudentRepository implements IStudentRepository {
    private studentModel: ModelStatic<StudentInstance>;
    constructor() {
        this.studentModel = Student;
    }

    async findAll(): Promise<StudentAttributes[]> {
        return await this.studentModel.findAll();
    }

    async findById(id: number, transaction?: Transaction): Promise<StudentAttributes | null> {
        return await this.studentModel.findByPk(id, { transaction });
    }

    async findByUserId(userId: number, transaction?: Transaction): Promise<StudentAttributes | null> {
        return await this.studentModel.findOne({ where: { userId }, transaction });
    }

    async create(data: StudentAttributes, transaction?: Transaction): Promise<StudentAttributes> {
        return await this.studentModel.create(data, { transaction });
    }

    async update(id: number, data: Partial<StudentAttributes>, transaction?: Transaction): Promise<[number]> {
        return await this.studentModel.update(data, { where: { id }, transaction });
    }

    async delete(id: number, transaction?: Transaction): Promise<number> {
        return await this.studentModel.destroy({ where: { id }, transaction });
    }

    async findByGroupId(groupId: number, transaction?: Transaction): Promise<StudentAttributes[]> {
        return await this.studentModel.findAll({ where: { groupId }, transaction });
    }
}