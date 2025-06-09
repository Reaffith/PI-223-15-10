import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/UserService";
import { UserAttributes } from "../models/entities/User.model";
import { Request, Response } from "express";
import { RolesEnum } from "../enums/RolesEnum";

@injectable()
export class UserController {
  constructor(@inject("UserService") private userService: UserService) {}

  private handleError(res: Response, error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }

      const loggedInUser = await this.userService.login(email, password);

      if (!loggedInUser) {
        return res.status(400).json({ message: "Wrong password" });
      }

      return res.status(200).json(loggedInUser);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
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
      const user = await this.userService.getUserById(+id);
      if (!user) {
        return res.status(404).json({ message: "No such user" });
      }
      return res.status(200).json(user);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      if (role === RolesEnum.ADMIN || role === RolesEnum.MANAGER) {
        const newUser = await this.userService.createUser(email, password, role);
        if (!newUser) {
          return res.status(400).json({ message: "Incorrect data passed" });
        }
        return res.status(201).json(newUser);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, password, role: newRole, role } = req.body;
      if (role === RolesEnum.ADMIN || role === RolesEnum.MANAGER) {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }
        if (!email && !password && !newRole) {
          return res.status(400).json({ message: "No data passed in the body" });
        }
        const updatedUser = await this.userService.updateUser(+id, { email, password, role: newRole });
        if (!updatedUser) {
          return res.status(404).json({ message: "No such user" });
        }
        return res.status(200).json(updatedUser);
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
      if (role === RolesEnum.ADMIN || role === RolesEnum.MANAGER) {
        if (!id || isNaN(+id) || +id < 0) {
          return res.status(400).json({ message: "Incorrect Id passed" });
        }
        const isDeleted = await this.userService.deleteUser(+id);
        if (!isDeleted) {
          return res.status(404).json({ message: "No such user" });
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