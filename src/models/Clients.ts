import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class Clients extends Model {
  public id!: typeof DataTypes.UUID;
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Clients.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: {type: DataTypes.STRING, allowNull: false}
  },
  {
    sequelize,
    modelName: "clients",
  }
);
