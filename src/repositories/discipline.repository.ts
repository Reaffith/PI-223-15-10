import { Transaction } from "sequelize";
import { IDisciplineRepository } from "../interfaces/repository-interfaces/discipline-repository.interface";
import { Discipline, DisciplineAttributes } from "../models/entities/Discipline.model";
import { inject, injectable } from "tsyringe";

@injectable()
export class DisciplineRepository implements IDisciplineRepository {
    private readonly disciplineModel: typeof Discipline
    constructor() {
        this.disciplineModel = Discipline;
    }

    async getAll(): Promise<DisciplineAttributes[]> {
        return await this.disciplineModel.findAll();
    }

    async findById(id: number, transaction?: Transaction): Promise<DisciplineAttributes | null> {
        return await this.disciplineModel.findByPk(id, { transaction });
    }

    async findByTeacherId(teacherId: number, transaction?: Transaction): Promise<DisciplineAttributes[]> {
        return await this.disciplineModel.findAll({ where: {teacherId}, transaction });
    }

    async create(data: DisciplineAttributes, transaction?: Transaction): Promise<DisciplineAttributes> {
        return await this.disciplineModel.create(data, { transaction });
    }

    async update(id: number, data: Partial<DisciplineAttributes>, transaction?: Transaction): Promise<[number]> {
        return await this.disciplineModel.update(data, { where: { id }, transaction });
    }

    async delete(id: number, transaction?: Transaction): Promise<number> {
        return await this.disciplineModel.destroy({ where: { id }, transaction });
    }
}