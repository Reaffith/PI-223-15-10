import { ModelStatic, Transaction } from "sequelize";
import { IGroupDisciplineRepository } from "../interfaces/repository-interfaces/groupDiscipline-repository";
import { GroupDiscipline, GroupDisciplineAttributes, GroupDisciplineInstance } from "../models/entities/GroupDiscipline.model";
import { inject, injectable } from "tsyringe";

@injectable()
export class GroupDisciplineRepository implements IGroupDisciplineRepository {
    private readonly groupDisciplineModel: ModelStatic<GroupDisciplineInstance>;
    constructor() {
        this.groupDisciplineModel = GroupDiscipline;
    }
    
    async findAll(): Promise<GroupDisciplineAttributes[]> {
        return await this.groupDisciplineModel.findAll();
    }

    async findAllByGroupId(
        groupId: number,
        transaction?: Transaction
    ): Promise<GroupDisciplineAttributes[]> {
        return await this.groupDisciplineModel.findAll({
            where: { groupId },
            transaction,
        });
    }

    async findAllByDisciplineId(
        disciplineId: number,
        transaction?: Transaction
    ): Promise<GroupDisciplineAttributes[]> {
        return await this.groupDisciplineModel.findAll({
            where: { disciplineId },
            transaction,
        });
    }

    async create(disciplineId: number, groupId: number, transaction?: Transaction): Promise<GroupDisciplineAttributes> {
        return await this.groupDisciplineModel.create({disciplineId, groupId}, {transaction});
    }
}