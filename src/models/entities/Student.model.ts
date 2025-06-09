import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../../config/db';

export interface StudentAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  groupId: number;
  userId: number;
}

export interface StudentInstance extends Model<StudentAttributes>, StudentAttributes {}

export let Student: ModelStatic<StudentInstance>;

export function defineStudent() {
  Student = sequelize.define<StudentInstance>(
    'student',
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
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'id',
        },
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
    { tableName: 'students' }
  );
}