import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class Towns extends Model {
  public id!: typeof DataTypes.UUID;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Towns.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  {
    sequelize,
    modelName: "towns",
  }
);
