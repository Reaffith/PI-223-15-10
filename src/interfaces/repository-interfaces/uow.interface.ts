import { IUserRepository } from './user-repository.interface';
import { ITeacherRepository } from './teacher-repository.interface';
import { IStudentRepository } from './student-repository.interface';
import { IGroupRepository } from './group-repository.interface';
import { IDisciplineRepository } from './discipline-repository.interface';
import { IGradeRepository } from './grade-repository.interface';
import { Transaction } from 'sequelize';
import { IGroupDisciplineRepository } from './groupDiscipline-repository';

export interface IUnitOfWork {
  getUserRepository(): IUserRepository;
  getTeacherRepository(): ITeacherRepository;
  getStudentRepository(): IStudentRepository;
  getGroupRepository(): IGroupRepository;
  getDisciplineRepository(): IDisciplineRepository;
  getGradeRepository(): IGradeRepository;
  getGroupDisciplineRepository(): IGroupDisciplineRepository;
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getTransaction(): Transaction | undefined 
}