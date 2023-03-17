const { Op } = require("sequelize");
const { Reservation } = require("../models/models");

async function reservationDuplication(towns_id, master_id, start, end) {
  let duplication = await Reservation.findAll({
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
  return duplication.length;
}

module.exports = {
  reservationDuplication,
};
