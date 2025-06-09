import { Transaction } from "sequelize";
import { IGroupRepository } from "../interfaces/repository-interfaces/group-repository.interface";
import { Group, GroupAttributes } from "../models/entities/Group.model";
import { inject, injectable } from "tsyringe";

@injectable()
export class GroupRepository implements IGroupRepository {
    private readonly groupModel: typeof Group
    constructor() {
        this.groupModel = Group;
    }

    async findAll(): Promise<GroupAttributes[]> {
        return await this.groupModel.findAll();
    }

    async findById(id: number, transaction?: Transaction): Promise<GroupAttributes | null> {
        return await this.groupModel.findByPk(id, { transaction });
    }

    async create(data: GroupAttributes, transaction?: Transaction): Promise<GroupAttributes> {
        return await this.groupModel.create(data, { transaction });
    }

    async update(id: number, data: Partial<GroupAttributes>, transaction?: Transaction): Promise<[number]> {
        return await this.groupModel.update(data, { where: { id }, transaction });
    }

    async delete(id: number, transaction?: Transaction): Promise<number> {
        return await this.groupModel.destroy({ where: { id }, transaction });
    }
}