import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../../config/db';
import { RolesEnum } from '../../enums/RolesEnum';

export interface UserAttributes {
  id?: number;
  email: string;
  passwordHash: string;
  role: RolesEnum;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export let User: ModelStatic<UserInstance>;

export function defineUser() {
  User = sequelize.define<UserInstance>(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'manager', 'teacher', 'student', 'guest'),
        allowNull: false,
      },
    },
    { tableName: 'users' }
  );

  console.log('userCreated')
}