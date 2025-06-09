import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { GroupService } from "../services/GroupService";
import { GroupDisciplineService } from "../services/GroupDisciplineService";
import { DisciplineService } from "../services/DisciplineService";
import { Request, Response } from "express";
import { RolesEnum } from "../enums/RolesEnum";
import { DisciplineAttributes } from "../models/entities/Discipline.model";

@injectable()
export class GroupController {
  constructor(
    @inject("GroupService") private groupService: GroupService,
    @inject("GroupDisciplineService") private groupDisciplineService: GroupDisciplineService,
    @inject("DisciplineService") private disciplineService: DisciplineService
  ) {}

  private handleError(res: Response, error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  async create(req: Request, res: Response) {
    try {
      const { name, role } = req.body;
      if (role === RolesEnum.MANAGER) {
        const newGroup = await this.groupService.createGroup(name);
        return res.status(201).json(newGroup);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const groups = await this.groupService.getAllGroups();
      return res.status(200).json(groups);
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
      const group = await this.groupService.getGroupById(+id);
      if (!group) {
        return res.status(404).json({ message: "No such group" });
      }
      return res.status(200).json(group);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, role } = req.body;
      if (role === RolesEnum.MANAGER) {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }
        if (!name) {
          return res.status(400).json({ message: "No data passed in the body" });
        }
        const updatedGroup = await this.groupService.updateGroup(+id, name);
        if (!updatedGroup) {
          return res.status(404).json({ message: "No such group" });
        }
        return res.status(200).json(updatedGroup);
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
        const isDeleted = await this.groupService.deleteGroup(+id);
        if (!isDeleted) {
          return res.status(404).json({ message: "No such group" });
        }
        return res.status(204);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async createGroupDisciplineLink(req: Request, res: Response) {
    try {
      const { groupId, disciplineId, role } = req.body;
      if (role === RolesEnum.MANAGER || role == RolesEnum.ADMIN) {
        if (!groupId || isNaN(+groupId) || +groupId < 0 || !disciplineId || isNaN(+disciplineId) || +disciplineId < 0) {
          return res.status(400).json({ message: "Incorrect Ids passed" });
        }
        const newGroupDiscipline = await this.groupDisciplineService.create(+disciplineId, +groupId);
        return res.status(201).json(newGroupDiscipline);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAllDisciplinesByGroupId(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      if (!groupId || isNaN(+groupId) || +groupId < 0) {
        return res.status(400).json({ message: "Incorrect Id passed" });
      }
      const groupDisciplines = await this.groupDisciplineService.getAllByGroupId(+groupId);
      if (!groupDisciplines || groupDisciplines.length === 0) {
        return res.status(404).json({ message: "No disciplines found for group" });
      }
      const disciplineIds = groupDisciplines.map(gd => gd.disciplineId);
      const disciplines = await Promise.all(disciplineIds.map(id => this.disciplineService.getDisciplineById(id)));
      const validDisciplines = disciplines.filter(d => d !== null) as DisciplineAttributes[];
      return res.status(200).json(validDisciplines);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}