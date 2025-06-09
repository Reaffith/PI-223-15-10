import { GroupDisciplineAttributes } from "../../models/entities/GroupDiscipline.model";

export interface IGroupDisciplineService {
  getAll(): Promise<GroupDisciplineAttributes[]>;
  getAllByGroupId(groupId: number): Promise<GroupDisciplineAttributes[] | null>;
  getAllByDisciplineId(
    disciplineId: number
  ): Promise<GroupDisciplineAttributes[] | null>;
  create(
    disciplineId: number,
    groupId: number
  ): Promise<GroupDisciplineAttributes>;
}
