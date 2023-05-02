import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class Images extends Model {
  public id!: typeof DataTypes.UUID;
  public url!: string;
  public reservation_id!: typeof DataTypes.UUID;
  public public_id!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Images.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    url: { type: DataTypes.STRING, unique: true, allowNull: false },
    reservation_id: { type: DataTypes.UUID, allowNull: false },
    public_id: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "images",
  }
);
