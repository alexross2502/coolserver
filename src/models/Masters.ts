import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class Masters extends Model {
  public id!: typeof DataTypes.UUID;
  public name!: string;
  public surname!: string;
  public rating!: number;
  public townId?: typeof DataTypes.UUID;
  public email!: string;
  public mailConfirmation!: boolean;
  public adminApprove!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Masters.init(
  {
    id: {
      type: DataTypes.UUID,
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
    email: { type: DataTypes.CHAR(36), allowNull: false, unique: true },
    mailConfirmation: { type: DataTypes.BOOLEAN, allowNull: false },
    adminApprove: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  {
    sequelize,
    modelName: "masters",
  }
);
