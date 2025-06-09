import { TeacherAttributes } from "../../models/entities/Teacher.model";

export interface ITeacherService {
  getAllTeachers(): Promise<TeacherAttributes[]>;
  getTeacherById(id: number): Promise<TeacherAttributes | null>;
  getTeacherByUserId(userId: number): Promise<TeacherAttributes | null>;
  createTeacher(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<TeacherAttributes | null>;
  updateTeacher(
    id: number,
    data: Partial<TeacherAttributes>
  ): Promise<TeacherAttributes| null>;
  deleteTeacher(id: number): Promise<boolean>
}
