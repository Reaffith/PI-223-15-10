import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { IGroupService } from "../interfaces/service-interfaces/group-service.interface";
import { GroupAttributes } from "../models/entities/Group.model";

@injectable()
export class GroupService implements IGroupService {
    constructor(@inject('UnitOfWork') private uow: IUnitOfWork) {}

    async getGroupById(id: number): Promise<GroupAttributes | null> {
        return await this.uow.getGroupRepository().findById(id);
    }

    async getAllGroups(): Promise<GroupAttributes[]> {
        return await this.uow.getGroupRepository().findAll();
    }

    async createGroup(name: string): Promise<GroupAttributes> {
        this.uow.beginTransaction();

        try {
            const newGroup = await this.uow.getGroupRepository().create({name}, this.uow.getTransaction());

            await this.uow.commit();
            return newGroup;
        } catch (error) {
            console.log(error);
            await this.uow.rollback();
            throw new Error();            
        }
    }

    async updateGroup(id: number, name: string): Promise<GroupAttributes | null> {
        this.uow.beginTransaction();

        try {
            const oldGroup = await this.getGroupById(id);

            if (!oldGroup) {
                await this.uow.rollback();
                return null;
            } 

            const [updatedCount] = await this.uow.getGroupRepository().update(id, {name}, this.uow.getTransaction());

            if (updatedCount === 0) {
                await this.uow.rollback();
                return null;
            }

            await this.uow.commit();

            return await this.getGroupById(id);
        } catch (error) {
            this.uow.rollback();

            throw new Error();
        }
    }

    async deleteGroup(id: number): Promise<boolean> {
        this.uow.beginTransaction();

        try {
            const group = await this.getGroupById(id);

            if (!group) {
                this.uow.rollback();
                return false;
            }

            const deletedCount = await this.uow.getGroupRepository().delete(id, this.uow.getTransaction());

            if (deletedCount < 1) {
                this.uow.rollback();
                return false;
            }

            this.uow.commit();
            return true;
        } catch (error) {
            this.uow.rollback();

            throw new Error();
        }
    }
}