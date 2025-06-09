import { GroupAttributes } from "../../models/entities/Group.model";

export interface IGroupService {
    getAllGroups(): Promise<GroupAttributes[]>;
    getGroupById(id: number): Promise<GroupAttributes | null>;
    createGroup(name: string): Promise<GroupAttributes>;
    updateGroup(id: number, name: string): Promise<GroupAttributes | null>;
    deleteGroup(id: number): Promise<boolean>;
}