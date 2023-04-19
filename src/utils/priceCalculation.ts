import { Towns } from "../models/Towns";
import { timeSize } from "./constants";

export default async function (id, size) {
  const town = await Towns.findOne({
    where: { id: id },
    attributes: ["tariff"],
  });
  return town.dataValues.tariff * timeSize[size];
}
