import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../../config/db';

export interface TeacherAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  userId: number;
}

export interface TeacherInstance extends Model<TeacherAttributes>, TeacherAttributes {}

export let Teacher: ModelStatic<TeacherInstance>;

export function defineTeacher() {
  Teacher = sequelize.define<TeacherInstance>(
    'teacher',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    { tableName: 'teachers' }
  );
}