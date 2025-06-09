import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { IGroupDisciplineService } from "../interfaces/service-interfaces/groupDiscipline-service.interface";
import { GroupDisciplineAttributes } from "../models/entities/GroupDiscipline.model";

@injectable()
export class GroupDisciplineService implements IGroupDisciplineService {
    constructor(@inject('UnitOfWork') private uow: IUnitOfWork) {}

    async getAll(): Promise<GroupDisciplineAttributes[]> {
        return await this.uow.getGroupDisciplineRepository().findAll();
    }

    async getAllByDisciplineId(disciplineId: number): Promise<GroupDisciplineAttributes[] | null> {
        return await this.uow.getGroupDisciplineRepository().findAllByDisciplineId(disciplineId);
    }

    async getAllByGroupId(groupId: number): Promise<GroupDisciplineAttributes[] | null> {
        return await this.uow.getGroupDisciplineRepository().findAllByGroupId(groupId);
    }

   async create(disciplineId: number, groupId: number): Promise<GroupDisciplineAttributes> {
    await this.uow.beginTransaction();

    try {
       const newGroupDiscipline =  await this.uow.getGroupDisciplineRepository().create(disciplineId, groupId, this.uow.getTransaction());
        
       await this.uow.commit();
       return newGroupDiscipline;
    } catch (error) {
        await this.uow.rollback();
        throw new Error();
    }
   }
}