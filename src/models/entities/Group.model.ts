import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../../config/db';

export interface GroupAttributes {
  id?: number;
  name: string;
}

export interface GroupInstance extends Model<GroupAttributes>, GroupAttributes {}

export let Group: ModelStatic<GroupInstance>;

export function defineGroup() {
  Group = sequelize.define<GroupInstance>(
    'group',
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
    },
    { tableName: 'groups' }
  );
}