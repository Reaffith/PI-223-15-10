import { Transaction } from "sequelize";
import { GroupAttributes } from "../../models/entities/Group.model";

export interface IGroupRepository {
    findAll(): Promise<GroupAttributes[]>
    findById(id: number, transaction?: Transaction): Promise<GroupAttributes | null>;
    create(data: GroupAttributes, transaction?: Transaction): Promise<GroupAttributes>;
    update(id: number, data: Partial<GroupAttributes>, transaction?: Transaction): Promise<[number]>;
    delete(id: number, transaction?: Transaction): Promise<number>;
}