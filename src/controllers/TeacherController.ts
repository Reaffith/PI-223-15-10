import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TeacherService } from "../services/TeacherService";
import { Request, Response, Router } from "express";
import { RolesEnum } from "../enums/RolesEnum";

@injectable()
export class TeacherController {
  constructor(
    @inject("TeacherService") private teacherService: TeacherService
  ) {}

  private handleError(res: Response, error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  async create(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      if (role === RolesEnum.MANAGER) {
        const newTeacher = await this.teacherService.createTeacher(
          email,
          password,
          firstName,
          lastName
        );

        if (!newTeacher) {
          return res.status(400).json({ message: "Incorrect data passed" });
        }

        return res.status(201).json(newTeacher);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const teachers = await this.teacherService.getAllTeachers();
      return res.status(200).json(teachers);
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

      const teacher = await this.teacherService.getTeacherById(+id);

      if (!teacher) {
        return res.status(404).json({ message: "No such teacher" });
      }

      return res.status(200).json(teacher);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOneByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId || isNaN(+userId) || +userId < 0) {
        return res.status(400).json({ message: "Incorrect Id passed" });
      }

      const teacher = await this.teacherService.getTeacherByUserId(+userId);
     
      if (!teacher) {
        return res.status(404).json({ message: "No such teacher" });
      }

      return res.status(200).json(teacher);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { firstName, lastName, role } = req.body;

      if (role === RolesEnum.MANAGER) {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }

        if (!firstName && !lastName) {
          return res
            .status(400)
            .json({ message: "No data passed in the body" });
        }

        const updatedTeacher = await this.teacherService.updateTeacher(+id, {
          firstName,
          lastName,
        });

        if (!updatedTeacher) {
          return res.status(404).json({ message: "No such teacher" });
        }

        return res.status(200).json(updatedTeacher);
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

      if (role === RolesEnum.MANAGER) {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }

        const isDeleted = await this.teacherService.deleteTeacher(+id);
        
        if (!isDeleted) {
          return res.status(404).json({ message: "No such teacher" });
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
