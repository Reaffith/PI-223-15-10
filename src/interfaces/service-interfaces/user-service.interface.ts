import { UserAttributes } from "../../models/entities/User.model";
import { RolesEnum } from "../../enums/RolesEnum";

export interface IUserService {
    getAllUsers(): Promise<UserAttributes[]>
    getUserById(id: number): Promise<UserAttributes | null>;
    getUserByEmail(email: string): Promise<UserAttributes | null>;
    createUser(email: string, password: string, role: RolesEnum): Promise<UserAttributes>;
    updateUser(id: number, data: Partial<UserAttributes>): Promise<UserAttributes | null>;
    deleteUser(id: number): Promise<boolean>;
    login(email: string, password: string): Promise<UserAttributes | null>;
}