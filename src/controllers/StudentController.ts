import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { StudentService } from "../services/StudentService";
import { Request, Response } from "express";
import { RolesEnum } from "../enums/RolesEnum";

@injectable()
export class StudentController {
  constructor(
    @inject("StudentService") private studentService: StudentService
  ) {}

  private handleError(res: Response, error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  async create(req: Request, res: Response) {
    const { email, password, firstName, lastName, groupId } = req.body;

    try {
      const newStudent = await this.studentService.createStudent(
        email,
        password,
        firstName,
        lastName,
        groupId
      );

      if (!newStudent) {
        return res.status(400).json({ message: "incorrect data passed" });
      }

      return res.status(201).json(newStudent);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const students = await this.studentService.getAllStudents();

      return res.status(200).json(students);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || isNaN(+id) || +id < 0) {
      return res.status(400).json({ message: "Incorrect Id passed" });
    }

    try {
      const student = await this.studentService.getStudentById(+id);

      if (!student) {
        return res.status(404).json({ message: "No such user" });
      }

      return res.status(200).json(student);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOneByUserId(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      if (!userId || isNaN(+userId) || +userId < 0) {
        return res.status(400).json({ message: "Incorrect Id passed" });
      }

      const student = await this.studentService.getStudentByUserId(+userId);

      if (!student) {
        return res.status(404).json({ message: "No such user" });
      }

      return res.status(200).json(student);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAllByGroupId(req: Request, res: Response) {
    const { groupId } = req.body;

    try {
      if (!groupId || isNaN(+groupId) || +groupId < 0) {
        return res.status(400).json({ message: "Incorrect Id passed" });
      }

      const students = await this.studentService.getStudentsByGroupId(+groupId);

      if (students.length === 0 || !students) {
        return res.status(404).json({ message: "No such students" });
      }

      return res.status(200).json(students);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { firstName, lastName, groupId, role } = req.body;

    if (role === RolesEnum.ADMIN || role === RolesEnum.MANAGER) {
      try {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }

        if (!firstName && !lastName && !groupId) {
          return res
            .status(400)
            .json({ message: "No data passes iun the body" });
        }

        const updatedStudent = await this.studentService.updateStudent(+id, {
          firstName,
          lastName,
          groupId,
        });

        if (!updatedStudent) {
          return res.status(404).json({ message: "no such student" });
        }

        return res.status(201).json(updatedStudent);
      } catch (error) {
        this.handleError(res, error);
      }
    } else {
      return res.status(403).json({ message: "Accsess denied" });
    }
  }

  async deleteStudent(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;

    if (role === RolesEnum.ADMIN || role === RolesEnum.MANAGER) {
      try {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }

        const isDeleted = await this.studentService.deleteStudent(+id);

        if (!isDeleted) {
          return res.status(404).json({ message: "No Such student" });
        }

        return res.status(204);
      } catch (error) {
        this.handleError(res, error);
      }
    } else {
      return res.status(403).json({ message: "Accsess denied" });
    }
  }
}
