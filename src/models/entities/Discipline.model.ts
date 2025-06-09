import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../../config/db';

export interface DisciplineAttributes {
  id?: number;
  name: string;
  teacherId: number;
}

export interface DisciplineInstance extends Model<DisciplineAttributes>, DisciplineAttributes {}

export let Discipline: ModelStatic<DisciplineInstance>;

export function defineDiscipline() {
  Discipline = sequelize.define<DisciplineInstance>(
    'discipline',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
    },
    { tableName: 'disciplines' }
  );
}