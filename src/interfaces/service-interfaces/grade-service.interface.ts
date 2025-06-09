import { GradeAttributes } from "../../models/entities/Grade.model";

export interface IGradeService {
    getAll() : Promise<GradeAttributes[]>;
    getById(id: number): Promise<GradeAttributes | null>;
    getAllByStudentId(studentId: number): Promise<GradeAttributes[] | null>;
    getAllByTeacherId(teacherId: number): Promise<GradeAttributes[] | null>;
    createGrade(data: GradeAttributes): Promise<GradeAttributes>;
    updateGrade(id: number, data: Partial<GradeAttributes>): Promise<GradeAttributes | null>;
    deleteGrade(id: number): Promise<boolean>;
}