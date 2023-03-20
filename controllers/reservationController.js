const { Reservation, Masters, Clients, Towns } = require("../models/models");
const ApiError = require("../error/ApiError");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const db = require("../models/index");
const { Op } = require("sequelize");
const { reservationDuplication } = require("../utils/reservationDuplication");

////// Настройки для размера часов
let timeSize = {
  small: 1,
  medium: 3,
  large: 5,
};

////Отправка письма
async function sendMail(recipient, name, surname, rating) {
  let transporter = nodemailer.createTransport({
    host: process.env.POST_HOST,
    auth: {
      user: process.env.POST_EMAIL,
      pass: process.env.POST_PASSWORD,
    },
  });

  let result = await transporter.sendMail({
    from: process.env.POST_EMAIL,
    to: recipient,
    subject: "Уведомление о резерве мастера",
    text: "This message was sent from Node js server.",
    html: `
    Вы успешно заказали мастера ${name} ${surname} с рейтингом ${rating} 
    `,
  });
}

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

class ReservationController {
  async getAll(req, res) {
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
    return res.json(reservation);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const reservation = await Reservation.destroy({ where: { id: id } });
    if (reservation) {
      return res.status(200).json(reservation).end();
    } else {
      return res.status(400).json({ message: "wrong data" }).end();
    }
  }

  async create(req, res, next) {
    let { day, size, master_id, towns_id, clientId } = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      let createdAt = Date.now();
      let updatedAt = Date.now();
      let start = new Date(+day);
      let end = new Date(+day + timeSize[size] * 3600 * 1000);
      day = new Date(+day);

      if (
        (await reservationDuplication(towns_id, master_id, start, end)) === 0
      ) {
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
        return res
          .status(400)
          .json({ message: "the master is busy at this time" })
          .end();
      }
    } catch (e) {
      return res.status(400).json({ message: "error" }).end();
    }
  }

  //Расчет подходящих мастеров
  async availableMasters(req, res, next) {
    let { day, size, towns_id } = req.body;
    let start = new Date(+day);
    let end = new Date(+day + timeSize[size] * 3600 * 1000);

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
  async makeOrder(req, res, next) {
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
      let end = new Date(+day + timeSize[size] * 3600 * 1000);
      day = new Date(+day);
      if (
        (await reservationDuplication(towns_id, master_id, start, end)) === 0
      ) {
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
        return res
          .status(400)
          .json({ message: "the master is busy at this time" })
          .end();
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "error" }).end();
    }
  }
}

module.exports = new ReservationController();
