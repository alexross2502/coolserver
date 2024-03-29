import { Model, DataTypes, WhereOptions } from "sequelize";
import sequelize from "../db";

export class Towns extends Model {
  public id!: typeof DataTypes.UUID;
  public name!: string;
  public tariff!: typeof DataTypes.INTEGER;

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
    tariff: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "towns",
  }
);

export type TownsWhereOptions = WhereOptions;
