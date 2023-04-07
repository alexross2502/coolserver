import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class Users extends Model {
  public id!: typeof DataTypes.UUID;
  public login!: string;
  public password!: string;
  public role!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    login: { type: DataTypes.CHAR(32), unique: true, allowNull: false },
    password: { type: DataTypes.CHAR(100), allowNull: false },
    role: { type: DataTypes.CHAR(16), allowNull: false },
    createdAt: { type: DataTypes.DATE(6) },
    updatedAt: { type: DataTypes.DATE(6) },
  },
  {
    sequelize,
    modelName: "users",
  }
);
