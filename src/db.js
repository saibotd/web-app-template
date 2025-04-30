import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./data/db.sqlite",
  logging: false,
});

export default db;
