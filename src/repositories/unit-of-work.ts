import { Sequelize, Transaction } from "sequelize";
import { UserRepository } from "./user.repository";
import { TeacherRepository } from "./teacher.repository";
import { StudentRepository } from "./student.repository";
import { GroupRepository } from "./group.repository";
import { DisciplineRepository } from "./discipline.repository";
import { GradeRepository } from "./grade.repository";
import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { GroupDisciplineRepository } from "./groupDiscipline.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class UnitOfWork implements IUnitOfWork {
  private transaction?: Transaction;
  constructor(
    @inject("Sequelize") private sequelize: Sequelize,
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("TeacherRepository") private teacherRepository: TeacherRepository,
    @inject("StudentRepository") private studentRepository: StudentRepository,
    @inject("GroupRepository") private groupRepository: GroupRepository,
    @inject("DisciplineRepository")
    private disciplineRepository: DisciplineRepository,
    @inject("GradeRepository") private gradeRepository: GradeRepository,
    @inject("GroupDisciplineRepository")
    private groupDisciplineRepository: GroupDisciplineRepository
  ) {}

  getUserRepository() {
    return this.userRepository;
  }

  getTeacherRepository() {
    return this.teacherRepository;
  }

  getStudentRepository() {
    return this.studentRepository;
  }

  getGroupRepository() {
    return this.groupRepository;
  }

  getDisciplineRepository() {
    return this.disciplineRepository;
  }

  getGradeRepository() {
    return this.gradeRepository;
  }

  getGroupDisciplineRepository() {
    return this.groupDisciplineRepository;
  }

  async beginTransaction() {
    this.transaction = await this.sequelize.transaction();
  }

  async commit() {
    if (this.transaction) {
      await this.transaction.commit();
      this.transaction = undefined;
    }
  }

  async rollback() {
    if (this.transaction) {
      await this.transaction.rollback();
      this.transaction = undefined;
    }
  }

  getTransaction(): Transaction | undefined {
    return this.transaction;
  }
}
