import { DataTypes } from "sequelize";
import db from "../src/db.js";
import bcrypt from "bcrypt";

const User = db.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  email: DataTypes.STRING,
  emailVerified: DataTypes.BOOLEAN,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  username: DataTypes.STRING,
  about: DataTypes.TEXT,
  password: {
    type: DataTypes.STRING,
    set(val) {
      this.setDataValue("password", bcrypt.hashSync(val, 4));
    },
  },
});

User.prototype.name = function () {
  if (!this.firstName && !this.lastName) return this.username;
  return `${this.firstName} ${this.lastName}`.trim();
};

User.prototype.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Role = db.define("roles", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

Role.hasMany(User);
User.belongsTo(Role);

export { User, Role };
