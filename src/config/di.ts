import "reflect-metadata";
import { container } from "tsyringe";
import { UserRepository } from "../repositories/user.repository";
import { TeacherRepository } from "../repositories/teacher.repository";
import { StudentRepository } from "../repositories/student.repository";
import { GroupRepository } from "../repositories/group.repository";
import { DisciplineRepository } from "../repositories/discipline.repository";
import { GradeRepository } from "../repositories/grade.repository";
import { GroupDisciplineRepository } from "../repositories/groupDiscipline.repository";
import { UnitOfWork } from "../repositories/unit-of-work";
import { sequelize } from "../config/db";
import { UserService } from "../services/UserService";
import { StudentService } from "../services/StudentService";
import { TeacherService } from "../services/TeacherService";
import { GroupService } from "../services/GroupService";
import { DisciplineService } from "../services/DisciplineService";
import { GradeService } from "../services/GradeService";
import { GroupDisciplineService } from "../services/GroupDisciplineService";
import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { StudentController } from "../controllers/StudentController";
import { UserController } from "../controllers/UserController";
import { ModelStatic, Sequelize } from "sequelize";
import { User } from "../models/entities/User.model";
import { Student } from "../models/entities/Student.model";
import { Teacher } from "../models/entities/Teacher.model";
import { Group } from "../models/entities/Group.model";
import { Discipline } from "../models/entities/Discipline.model";
import { Grade } from "../models/entities/Grade.model";
import { GroupDiscipline } from "../models/entities/GroupDiscipline.model";
import { GroupController } from "../controllers/GroupController";
import { DisciplineController } from "../controllers/DisciplineController";
import { TeacherController } from "../controllers/TeacherController";
import { GradeController } from "../controllers/GradeController";

container.register("User", { useValue: User });
container.register("Student", { useValue: Student });
container.register("Teacher", { useValue: Teacher });
container.register("Group", { useValue: Group });
container.register("Discipline", { useValue: Discipline });
container.register("Grade", { useValue: Grade });
container.register("GroupDiscipline", { useValue: GroupDiscipline });

// Репозиторії
container.register("UserRepository", {
  useClass: UserRepository,
});
container.register("TeacherRepository", { useClass: TeacherRepository });
container.register("StudentRepository", { useClass: StudentRepository });
container.register("GroupRepository", { useClass: GroupRepository });
container.register("DisciplineRepository", { useClass: DisciplineRepository });
container.register("GradeRepository", { useClass: GradeRepository });
container.register("GroupDisciplineRepository", {
  useClass: GroupDisciplineRepository,
});

// Sequelize
container.register("Sequelize", { useValue: sequelize });

// Unit of Work
container.register("UnitOfWork", {
  useClass: UnitOfWork,
});

// Сервіси
container.register("UserService", { useClass: UserService });
container.register("StudentService", {
  useClass: StudentService,
});
container.register("TeacherService", {
  useClass: TeacherService,
});
container.register("GroupService", { useClass: GroupService });
container.register("DisciplineService", { useClass: DisciplineService });
container.register("GradeService", { useClass: GradeService });
container.register("GroupDisciplineService", {
  useClass: GroupDisciplineService,
});

// Контролери
container.register("StudentController", { useClass: StudentController });
container.register("UserController", { useClass: UserController });
container.register("GroupController", { useClass: GroupController });
container.register("DisciplineController", { useClass: DisciplineController });
container.register("TeacherController", { useClass: TeacherController });
container.register("GradeController", { useClass: GradeController });

export { container };
