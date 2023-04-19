import { Reservation, Masters, Clients, Towns } from "../models/models";
import * as expressValidator from "express-validator";
const { Op } = require("sequelize");
const {
  reservationDuplicationCheck,
} = require("../utils/reservationDuplication");
import * as express from "express";
import * as constants from "../utils/constants";
import { sendClientOrderMail } from "../utils/sendMail";
import { generateRandomPassword } from "../utils/generateRandomPassword";
import { passwordHash } from "../utils/passwordHash";
import { sendNewPassword } from "../utils/sendMail";
import { createNewClient } from "../utils/createNewClient";
import priceCalculation from "../utils/priceCalculation";

//Создание нового клиента, если такой почты не существует
async function check(name, email) {
  let newPassword = generateRandomPassword();
  let hashedPassword = await passwordHash(newPassword);
  let created = await createNewClient(name, email, hashedPassword, false);
  if (created) {
    sendNewPassword(email, newPassword);
  }
  let client = await Clients.findOne({ where: { email } });
  return client.dataValues.id;
}

export async function getAll(req: express.Request, res: express.Response) {
  const reservation = await Reservation.findAll();
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

    if (
      (await reservationDuplicationCheck(towns_id, master_id, start, end)) === 0
    ) {
      const price = await priceCalculation(towns_id, size);
      const reservation = await Reservation.create({
        day,
        end,
        size,
        master_id,
        towns_id,
        clientId,
        createdAt,
        updatedAt,
        price,
      });
      return res.status(200).json(reservation).end();
    } else {
      throw new Error("Duplication's error");
    }
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
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
        adminApprove: true,
        townId: towns_id,
        id: {
          [Op.not]: Array.from(notAvailable, (el) => el.dataValues.master_id),
        },
      },
    });

    return res.status(200).json(available).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
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

  try {
    //Создание нового клиента или получения id уже существующего
    let clientId = await check(clientName, recipient);
    let createdAt = Date.now();
    let updatedAt = Date.now();
    let start = new Date(+day);
    let end = new Date(+day + constants.timeSize[size] * 3600 * 1000);
    day = new Date(+day);
    if (
      (await reservationDuplicationCheck(towns_id, master_id, start, end)) === 0
    ) {
      const price = await priceCalculation(towns_id, size);
      console.log(price);
      const reservation = await Reservation.create({
        day,
        end,
        size,
        master_id,
        towns_id,
        clientId,
        createdAt,
        updatedAt,
        price,
      });
      //Отправка письма
      const town = await Towns.findOne({
        where: {
          id: towns_id,
        },
      });
      sendClientOrderMail(
        recipient,
        name,
        surname,
        rating,
        day,
        size,
        town.dataValues.name
      );
      return res.status(200).json(reservation).end();
    } else {
      throw new Error("error");
    }
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}
