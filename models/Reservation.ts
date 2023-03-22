import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class Reservation extends Model {
  public id!: typeof DataTypes.UUID;
  public day!: Date;
  public size!: string;
  public end!: Date;
  public master_id!: typeof DataTypes.UUID;
  public towns_id!: typeof DataTypes.UUID;
  public clientId!: typeof DataTypes.UUID;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    day: {
      type: DataTypes.DATE(6),
      allowNull: false,
    },
    size: {
      type: DataTypes.CHAR(30),
      allowNull: false,
    },
    end: { type: DataTypes.DATE(6), allowNull: false },
    master_id: { type: DataTypes.CHAR(36), allowNull: true },
    towns_id: { type: DataTypes.CHAR(36), allowNull: true },
    clientId: { type: DataTypes.CHAR(36), allowNull: true },
  },
  {
    sequelize,
    modelName: "reservations",
  }
);
