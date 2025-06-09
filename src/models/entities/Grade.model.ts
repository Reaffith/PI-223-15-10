import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../../config/db';

export interface GradeAttributes {
  id?: number;
  studentId: number;
  disciplineId: number;
  teacherId: number;
  value: number;
}

export interface GradeInstance extends Model<GradeAttributes>, GradeAttributes {}

export let Grade: ModelStatic<GradeInstance>;

export function defineGrade() {
  Grade = sequelize.define<GradeInstance>(
    'grade',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
      },
      disciplineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'disciplines',
          key: 'id',
        },
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 100 },
      },
    },
    { tableName: 'grades' }
  );
}