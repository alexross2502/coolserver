import { Model, DataTypes, WhereOptions } from "sequelize";
import sequelize from "../db";
import { Images } from "./Images";
import { Clients, Masters, Towns } from "./models";


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
  public images?: typeof DataTypes.VIRTUAL;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface ReservationAttributes {
  id?: typeof DataTypes.UUID;
  day?: Date;
  size?: string;
  end?: Date;
  master_id?: typeof DataTypes.UUID;
  towns_id?: typeof DataTypes.UUID;
  clientId?: typeof DataTypes.UUID;
  status?: typeof DataTypes.ENUM;
  price?: typeof DataTypes.INTEGER;
  images?: typeof DataTypes.VIRTUAL;
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
    images: {
      type: DataTypes.VIRTUAL,
    },
  },
  {
    sequelize,
    modelName: "reservations",
  }
);

Reservation.belongsTo(Clients, { foreignKey: "clientId" });
Reservation.belongsTo(Masters, { foreignKey: "master_id" });
Reservation.belongsTo(Towns, { foreignKey: "towns_id" });

export type ReservationsWhereOptions = WhereOptions;
