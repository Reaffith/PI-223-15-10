import { Transaction } from "sequelize";
import { GroupDisciplineAttributes } from "../../models/entities/GroupDiscipline.model";

export interface IGroupDisciplineRepository {
  findAll(): Promise<GroupDisciplineAttributes[]>;
  findAllByGroupId(
    groupId: number,
    transaction?: Transaction
  ): Promise<GroupDisciplineAttributes[]>;
  findAllByDisciplineId(
    disciplineId: number,
    transaction?: Transaction
  ): Promise<GroupDisciplineAttributes[]>;
  create(
    disciplineId: number,
    groupId: number,
    transaction?: Transaction
  ): Promise<GroupDisciplineAttributes>;
}
