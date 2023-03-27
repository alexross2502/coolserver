import { Reservation, Masters, Clients } from "../models/models";
import * as expressValidator from "express-validator";
const { Op } = require("sequelize");
const { reservationDuplication } = require("../utils/reservationDuplication");
import * as express from "express";
import * as constants from "../utils/constants";
import { sendMail } from "../utils/sendMail";

//Создание нового клиента, если такой почты не существует
async function check(name, email) {
  const [client, created] = await Clients.findOrCreate({
    where: { email: email },
    defaults: {
      name: name,
      email: email,
    },
  });

  return client.dataValues.id;
}

export async function getAll(req: express.Request, res: express.Response) {
  const reservation = await Reservation.findAll({
    attributes: [
      "id",
      "day",
      "end",
      "size",
      "master_id",
      "towns_id",
      "clientId",
    ],
  });
  return res.status(200).json(reservation).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  const { id } = req.params;
  const reservation = await Reservation.destroy({ where: { id: id } });
  if (reservation) {
    return res.status(200).json(reservation).end();
  } else {
    return res.status(400).json({ message: "wrong data" }).end();
  }
}

export async function create(req: express.Request, res: express.Response) {
  let { day, size, master_id, towns_id, clientId } = req.body;

  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    let createdAt = Date.now();
    let updatedAt = Date.now();
    let start = new Date(+day);
    let end = new Date(+day + constants.timeSize[size] * 3600 * 1000);
    day = new Date(+day);

    if ((await reservationDuplication(towns_id, master_id, start, end)) === 0) {
      const reservation = await Reservation.create({
        day,
        end,
        size,
        master_id,
        towns_id,
        clientId,
        createdAt,
        updatedAt,
      });
      return res.status(200).json(reservation).end();
    } else {
      throw new Error("Duplication's error");
    }
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
  }
}

//Расчет подходящих мастеров
export async function availableMasters(
  req: express.Request,
  res: express.Response
) {
  let { day, size, towns_id } = req.body;
  let start = new Date(+day);
  let end = new Date(+day + constants.timeSize[size] * 3600 * 1000);

  try {
    let notAvailable = await Reservation.findAll({
      where: {
        towns_id,
        [Op.or]: [
          {
            ////////////////
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
          //////////////////
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

    let available = await Masters.findAll({
      where: {
        townId: towns_id,
        id: {
          [Op.not]: Array.from(notAvailable, (el) => el.dataValues.master_id),
        },
      },
    });

    return res.status(200).json(available).end();
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
  }
}

////Создание клиентского резерва
export async function makeOrder(req: express.Request, res: express.Response) {
  let {
    day,
    size,
    master_id,
    towns_id,
    recipient,
    name,
    surname,
    rating,
    clientName,
  } = req.body;

  //Создание нового клиента или получения id уже существующего
  let clientId = await check(clientName, recipient);

  try {
    let createdAt = Date.now();
    let updatedAt = Date.now();
    let start = new Date(+day);
    let end = new Date(+day + constants.timeSize[size] * 3600 * 1000);
    day = new Date(+day);
    if ((await reservationDuplication(towns_id, master_id, start, end)) === 0) {
      const reservation = await Reservation.create({
        day,
        end,
        size,
        master_id,
        towns_id,
        clientId,
        createdAt,
        updatedAt,
      });
      //Отправка письма
      sendMail(recipient, name, surname, rating);
      return res.status(200).json(reservation).end();
    } else {
      throw new Error("error");
    }
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
  }
}
