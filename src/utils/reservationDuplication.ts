import { Op } from "sequelize";
import { Reservation } from "../models/models";

async function reservationDuplicationCheck(
  towns_id: string,
  master_id: string,
  start: Date,
  end: Date
): Promise<number> {
  let duplication = await Reservation.count({
    where: {
      towns_id,
      master_id,
      [Op.or]: [
        {
          [Op.and]: {
            day: {
              [Op.lt]: end,
            },
            end: {
              [Op.gte]: end,
            },
          },
        },
        ////////////////////
        {
          [Op.and]: {
            day: {
              [Op.lte]: start,
            },
            end: {
              [Op.gt]: start,
            },
          },
        },
        {
          [Op.and]: {
            day: {
              [Op.gte]: start,
            },
            end: {
              [Op.lte]: end,
            },
          },
          ///////////////////
        },
      ],
    },
  });
  return duplication;
}

export { reservationDuplicationCheck };
