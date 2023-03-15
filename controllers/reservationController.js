const { Reservation, Masters, Clients, Towns } = require("../models/models");
const ApiError = require("../error/ApiError");
const nodemailer = require("nodemailer");
const Validator = require("../middleware/validator");
const db = require("../models/index");
const { Op } = require("sequelize");

////// Настройки для размера часов
let timeSize = {
  small: 1,
  medium: 3,
  large: 5,
};
/*
////Отправка письма
async function sendMail(recipient, name, surname, rating) {
  let transporter = nodemailer.createTransport({
    host: process.env.POST_HOST,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let result = await transporter.sendMail({
    from: process.env.EMAIL,
    to: recipient,
    subject: "Уведомление о резерве мастера",
    text: "This message was sent from Node js server.",
    html: `
    Вы успешно заказали мастера ${name} ${surname} с рейтингом ${rating} 
    `,
  });
}*/
/*
//Создание нового клиента, если такой почты не существует
async function check(name, email) {
  let existence = await Clients.findOne({
    where: { email: email },
  });
  if (existence == null) {
    const client = await Clients.create({ name, email });
  }
}*/

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
      let createdAt = Date.now();
      let updatedAt = Date.now();
      let d = new Date(+day);
      let end = new Date(+day + timeSize[size] * 3600 * 1000);

      day = d;

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
              ////////////////////
              [Op.and]: {
                day: {
                  [Op.lte]: start,
                },
                end: {
                  [Op.gt]: start,
                },
              },
              //////////////////
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
  /*
  async makeOrder(req, res, next) {
    const {
      day,
      hours,
      master_id,
      towns_id,
      recipient,
      name,
      surname,
      rating,
      clientName,
    } = req.body;

    if (
      Validator.dateChecker(day, hours) &&
      Validator.hoursChecker(hours) &&
      Validator.checkCreateReservation(master_id, towns_id) &&
      Validator.checkEmail(recipient) &&
      Validator.checkName(name) &&
      Validator.checkName(surname) &&
      Validator.checkName(clientName) &&
      Validator.checkRating(rating) &&
      Validator.dateRange(day) &&
      (await Validator.sameTime(day, hours, master_id))
    ) {
      try {
        let createdAt = Date.now();
        let updatedAt = Date.now();
        const reservation = await Reservation.create({
          day,
          hours,
          master_id,
          towns_id,
          createdAt,
          updatedAt,
        });

        //Отправка письма
        sendMail(recipient, name, surname, rating);
        //Создание нового клиента
        check(clientName, recipient);
        return res.json(reservation);
      } catch (e) {
        next(ApiError.badRequest(e.message));
      }
    } else return res.json("Неверные данные");
  }*/
}

module.exports = new ReservationController();
