import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class Masters extends Model {
  public id!: typeof DataTypes.UUID;
  public name!: string;
  public surname!: string;
  public rating!: number;
  public townId!: typeof DataTypes.UUID;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Masters.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    rating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 },
      allowNull: false,
    },
    townId: { type: DataTypes.CHAR(36), allowNull: true },
  },
  {
    sequelize,
    modelName: "masters",
  }
);
