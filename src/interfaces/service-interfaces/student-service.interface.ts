import { StudentAttributes } from "../../models/entities/Student.model";

export interface IStudentService {
  getAllStudents(): Promise<StudentAttributes[]>;
  getStudentById(id: number): Promise<StudentAttributes | null>;
  getStudentsByGroupId(groupId: number): Promise<StudentAttributes[]>;
  getStudentByUserId(userId: number): Promise<StudentAttributes | null>;
  createStudent(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    groupId: number
  ): Promise<StudentAttributes | null>;
  updateStudent(
    id: number,
    data: Partial<StudentAttributes>
  ): Promise<StudentAttributes | null>;
  deleteStudent(id: number): Promise<boolean>;
}
