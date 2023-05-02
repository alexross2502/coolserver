import { Reservation, Masters, Clients, Towns, Images } from "../models/models";
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
import priceCalculation from "../utils/priceCalculator";
import { ReservationsWhereOptions } from "../models/Reservation";
import * as base64Img from "base64-img";
import { whereOptionsParser } from "../utils/whereOptionsParser";
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

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
  const options: ReservationsWhereOptions = { where: {} };
  const { offset, limit } = req.query;
  const total = await Reservation.count();
  const reservation = await Reservation.findAll(
    whereOptionsParser({ options, limit, offset })
  );
  return res.status(200).json({ data: reservation, total }).end();
}

export async function getAllImages(
  req: express.Request,
  res: express.Response
) {
  let { id } = req.body;
  try {
    const images = await Images.findAll({ where: { reservation_id: id } });
    return res.status(200).json(images).end();
  } catch (e) {
    return res.status(400).json({ message: "wrong data" }).end();
  }
}

export async function destroy(req: express.Request, res: express.Response) {
  const { id } = req.params;
  const reservation = await Reservation.destroy({ where: { id: id } });
  await Images.destroy({ where: { reservation_id: id } });
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
      const city = await Towns.findOne({
        where: { id: towns_id },
        attributes: ["tariff"],
      });
      const price = await priceCalculation(city.dataValues.tariff, size);
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
    image,
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
      ////////////////////

      //////////////////
      const city = await Towns.findOne({
        where: { id: towns_id },
        attributes: ["tariff"],
      });
      const price = await priceCalculation(city.dataValues.tariff, size);
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
        images: image.length !== 0,
      });
      if (image.length !== 0) {
        const reservation_id = reservation.dataValues.id;
        for (let i = 0; i < image.length; i++) {
          const imageBinary = base64Img.imgSync(image[i].img, "", `png`);
          const result = await cloudinary.uploader.upload(imageBinary, {
            public_id: image[i].id,
          });
          console.log(result);
          await Images.create({
            url: result.secure_url,
            reservation_id,
            public_id: result.public_id,
          });
        }
      }
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
