import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { GradeService } from "../services/GradeService";
import { Request, Response } from "express";
import { RolesEnum } from "../enums/RolesEnum";

@injectable()
export class GradeController {
  constructor(@inject("GradeService") private gradeService: GradeService) {}

  private handleError(res: Response, error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  async create(req: Request, res: Response) {
    try {
      const { data, role } = req.body;
      if (role === RolesEnum.TEACHER) {
        const newGrade = await this.gradeService.createGrade(data);
        return res.status(201).json(newGrade);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const grades = await this.gradeService.getAll();
      return res.status(200).json(grades);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || isNaN(+id) || +id < 0) {
        return res.status(400).json({ message: "Incorrect Id passed" });
      }
      const grade = await this.gradeService.getById(+id);
      if (!grade) {
        return res.status(404).json({ message: "No such grade" });
      }
      return res.status(200).json(grade);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAllByStudentId(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const {role} = req.body;
      if (role === RolesEnum.STUDENT) {
        if (!studentId || isNaN(+studentId) || +studentId < 0) {
        return res.status(400).json({ message: "Incorrect Id passed" });
      }
      const grades = await this.gradeService.getAllByStudentId(+studentId);
      if (!grades) {
        return res.status(404).json({ message: "No grades found for student" });
      }
      return res.status(200).json(grades);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAllByTeacherId(req: Request, res: Response) {
    try {
      const { teacherId } = req.params;
      if (!teacherId || isNaN(+teacherId) || +teacherId < 0) {
        return res.status(400).json({ message: "Incorrect Id passed" });
      }
      const grades = await this.gradeService.getAllByTeacherId(+teacherId);
      if (!grades) {
        return res.status(404).json({ message: "No grades found for teacher" });
      }
      return res.status(200).json(grades);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, role } = req.body;
      if (role === RolesEnum.TEACHER) {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }
        if (!data) {
          return res.status(400).json({ message: "No data passed in the body" });
        }
        const updatedGrade = await this.gradeService.updateGrade(+id, data);
        if (!updatedGrade) {
          return res.status(404).json({ message: "No such grade" });
        }
        return res.status(200).json(updatedGrade);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (role === RolesEnum.TEACHER) {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }
        const isDeleted = await this.gradeService.deleteGrade(+id);
        if (!isDeleted) {
          return res.status(404).json({ message: "No such grade" });
        }
        return res.status(204);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }
}