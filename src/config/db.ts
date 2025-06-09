import { Sequelize } from 'sequelize';
import { User, defineUser } from '../models/entities/User.model';
import { Teacher, defineTeacher } from '../models/entities/Teacher.model';
import { Student, defineStudent } from '../models/entities/Student.model';
import { Group, defineGroup } from '../models/entities/Group.model';
import { Discipline, defineDiscipline } from '../models/entities/Discipline.model';
import { Grade, defineGrade } from '../models/entities/Grade.model';
import { GroupDiscipline, defineGroupDiscipline } from '../models/entities/GroupDiscipline.model';

export const sequelize = new Sequelize({
  database: 'Cursova',
   username: "postgres",
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  password: "1224",
});


export function initializeModels() {
  defineUser();
  defineTeacher();
  defineStudent();
  defineGroup();
  defineDiscipline();
  defineGrade();
  defineGroupDiscipline();

  // Асоціації
  User.hasOne(Teacher, { foreignKey: 'userId' });
  Teacher.belongsTo(User, { foreignKey: 'userId' });

  User.hasOne(Student, { foreignKey: 'userId' });
  Student.belongsTo(User, { foreignKey: 'userId' });

  Teacher.hasMany(Discipline, { foreignKey: 'teacherId' });
  Discipline.belongsTo(Teacher, { foreignKey: 'teacherId' });

  Group.hasMany(Student, { foreignKey: 'groupId' });
  Student.belongsTo(Group, { foreignKey: 'groupId' });

  Student.hasMany(Grade, { foreignKey: 'studentId' });
  Grade.belongsTo(Student, { foreignKey: 'studentId' });

  Discipline.hasMany(Grade, { foreignKey: 'disciplineId' });
  Grade.belongsTo(Discipline, { foreignKey: 'disciplineId' });

  Teacher.hasMany(Grade, { foreignKey: 'teacherId' });
  Grade.belongsTo(Teacher, { foreignKey: 'teacherId' });

  Group.belongsToMany(Discipline, { through: GroupDiscipline, foreignKey: 'groupId' });
  Discipline.belongsToMany(Group, { through: GroupDiscipline, foreignKey: 'disciplineId' });
}

export async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
    initializeModels();
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
}