import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../../config/db';

export interface GroupDisciplineAttributes {
  groupId: number;
  disciplineId: number;
}

export interface GroupDisciplineInstance extends Model<GroupDisciplineAttributes>, GroupDisciplineAttributes {}

export let GroupDiscipline: ModelStatic<GroupDisciplineInstance>;

export function defineGroupDiscipline() {
  GroupDiscipline = sequelize.define<GroupDisciplineInstance>(
    'group_discipline',
    {
      groupId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'id',
        },
      },
      disciplineId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'disciplines',
          key: 'id',
        },
      },
    },
    { tableName: 'group_disciplines' }
  );
}