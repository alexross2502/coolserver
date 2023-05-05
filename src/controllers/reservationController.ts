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
import sequelize from "../db";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

//Создание нового клиента, если такой почты не существует
async function check(name, email, { transaction }) {
  let newPassword = generateRandomPassword();
  let hashedPassword = await passwordHash(newPassword);
  let created = await createNewClient(name, email, hashedPassword, false);
  if (created) {
    sendNewPassword(email, newPassword);
  }
  let client = await Clients.findOne({
    where: { email },
    transaction: transaction,
  });
  return client.dataValues.id;
}

export async function getAll(req: express.Request, res: express.Response) {
  const options: ReservationsWhereOptions = {
    where: {},
    order: [],
    include: [],
    attributes: [
      "id",
      "day",
      "size",
      "end",
      "master_id",
      "towns_id",
      "clientId",
      "status",
      "price",
      [
        sequelize.literal(
          "(SELECT id FROM images WHERE reservation_id = reservations.id LIMIT 1)"
        ),
        "images",
      ],
    ],
  };
  const { offset, limit, sortedField, sortingOrder } = req.query;
  const total = await Reservation.count();
  console.log(sortedField, sortingOrder, "in controller");
  console.log(
    { options, limit, offset, sortedField, sortingOrder },
    "in controller"
  );
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
  let transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const reservation = await Reservation.destroy({
      where: { id: id },
      transaction: transaction,
    });
    const imagesArray = await Images.findAll({
      where: { reservation_id: id },
      attributes: ["public_id"],
      transaction: transaction,
    });
    await Images.destroy({
      where: { reservation_id: id },
      transaction: transaction,
    });
    for (const el of imagesArray) {
      let deletedImages = await cloudinary.uploader.destroy(
        `${el.dataValues.public_id}`
      );
      if (deletedImages.result !== "ok") {
        throw new Error("image deletion error");
      }
    }
    if (reservation) {
      await transaction.commit();
      return res.status(200).json(reservation).end();
    } else {
      throw new Error("error");
    }
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(400).json({ message: e.message }).end();
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
    images,
  } = req.body;
  let transaction = await sequelize.transaction();
  try {
    //Создание нового клиента или получения id уже существующего
    let clientId = await check(clientName, recipient, { transaction });
    let createdAt = Date.now();
    let updatedAt = Date.now();
    let start = new Date(+day);
    let end = new Date(+day + constants.timeSize[size] * 3600 * 1000);
    day = new Date(+day);
    if (
      (await reservationDuplicationCheck(towns_id, master_id, start, end, {
        transaction,
      })) === 0
    ) {
      const city = await Towns.findOne({
        where: { id: towns_id },
        attributes: ["tariff"],
        transaction: transaction,
      });
      const price = await priceCalculation(city.dataValues.tariff, size);
      const reservation = await Reservation.create(
        {
          day,
          end,
          size,
          master_id,
          towns_id,
          clientId,
          createdAt,
          updatedAt,
          price,
        },
        { transaction }
      );
      if (images.length !== 0) {
        const reservation_id = reservation.dataValues.id;
        for (let i = 0; i < images.length; i++) {
          const imageBinary = base64Img.imgSync(images[i].img, "");
          const matches = images[i].img.match(/^data:image\/([a-z]+);base64,/i);
          const extension = matches[1];
          if (!constants.imagesExtension.includes(extension)) {
            throw new Error("wrong extension");
          }
          const result = await cloudinary.uploader.upload(imageBinary, {
            public_id: images[i].id,
          });
          await Images.create(
            {
              url: result.secure_url,
              reservation_id,
              public_id: result.public_id,
            },
            { transaction }
          );
        }
      }
      //Отправка письма
      const town = await Towns.findOne({
        where: {
          id: towns_id,
        },
        transaction: transaction,
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
      await transaction.commit();
      return res.status(200).json(reservation).end();
    } else {
      throw new Error("error");
    }
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(400).json({ message: e.message }).end();
  }
}
