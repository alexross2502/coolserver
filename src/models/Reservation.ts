import { Model, DataTypes } from "sequelize";
import sequelize from "../db";
import { Clients } from "./Clients";
import { Masters } from "./Masters";

export class Reservation extends Model {
  public id!: typeof DataTypes.UUID;
  public day!: Date;
  public size!: string;
  public end!: Date;
  public master_id?: typeof DataTypes.UUID;
  public towns_id?: typeof DataTypes.UUID;
  public clientId?: typeof DataTypes.UUID;
  public status!: typeof DataTypes.ENUM;
  public price!: typeof DataTypes.INTEGER;

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
    status: {
      type: DataTypes.ENUM("canceled", "confirmed", "executed"),
      defaultValue: "confirmed",
      allowNull: false,
    },
    price: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "reservations",
  }
);

Reservation.belongsTo(Clients, { foreignKey: "clientId" });
Reservation.belongsTo(Masters, { foreignKey: "master_id" });
