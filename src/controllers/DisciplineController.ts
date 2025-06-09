import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { DisciplineService } from "../services/DisciplineService";
import { Request, Response, Router } from "express";
import { RolesEnum } from "../enums/RolesEnum";

@injectable()
export class DisciplineController {
  constructor(@inject("DisciplineService") private disciplineService: DisciplineService) {}

  private handleError(res: Response, error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  async create(req: Request, res: Response) {
    try {
      const { name, teacherId } = req.body;
      const { role } = req.body;

      if (role === RolesEnum.MANAGER || role === RolesEnum.ADMIN) {
        const newDiscipline = await this.disciplineService.createDiscipline(name, teacherId);
        
        if (!newDiscipline) {
          return res.status(400).json({ message: "Incorrect data passed" });
        }

        return res.status(201).json(newDiscipline);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const disciplines = await this.disciplineService.getAllDisciplines();
      return res.status(200).json(disciplines);
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
      const discipline = await this.disciplineService.getDisciplineById(+id);
      if (!discipline) {
        return res.status(404).json({ message: "No such discipline" });
      }
      return res.status(200).json(discipline);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getDisciplinesByTeacherId(req: Request, res: Response) {
    try {
      const { teacherId } = req.params;
      if (!teacherId || isNaN(+teacherId) || +teacherId < 0) {
        return res.status(400).json({ message: "Incorrect Id passed" });
      }
      const disciplines = await this.disciplineService.getDisciplinesByTeacherId(+teacherId);
      if (!disciplines) {
        return res.status(404).json({ message: "No disciplines found for teacher" });
      }
      return res.status(200).json(disciplines);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, teacherId, role } = req.body;
      if (role === RolesEnum.MANAGER) {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }
        if (!name && !teacherId) {
          return res.status(400).json({ message: "No data passed in the body" });
        }
        const updatedDiscipline = await this.disciplineService.updateDiscipline(+id, { name, teacherId });
        if (!updatedDiscipline) {
          return res.status(404).json({ message: "No such discipline" });
        }
        return res.status(200).json(updatedDiscipline);
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
        const isDeleted = await this.disciplineService.deleteDiscipline(+id);
        if (!isDeleted) {
          return res.status(404).json({ message: "No such discipline" });
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