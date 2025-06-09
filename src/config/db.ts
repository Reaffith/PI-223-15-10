import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  database: 'Cursova',
   username: "postgres",
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  password: "1224",
});