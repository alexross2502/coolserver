const { Reservation, Masters, Clients, Towns } = require("../models/models");
const ApiError = require("../error/ApiError");
const nodemailer = require("nodemailer");
const Validator = require("../middleware/validator");
const db = require("../models/index");

////Отправка письма
async function sendMail(recipient, name, surname, rating) {
  let transporter = nodemailer.createTransport({
    host: "mail.ee",
    auth: {
      user: "alexross19941994@mail.ee",
      pass: "1aCN1c9XwT",
    },
  });

  let result = await transporter.sendMail({
    from: "alexross19941994@mail.ee",
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
  let existence = await Clients.findOne({
    where: { email: email },
  });
  if (existence == null) {
    const client = await Clients.create({ name, email });
  }
}

class ReservationController {
  async getAll(req, res) {
    const reservation = await Reservation.findAll({
      attributes: [
        "id",
        "day",
        "size",
        "hours",
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
    return res.json(reservation);
  }

  async create(req, res, next) {
    let { day, size, hours, master_id, towns_id, clientId } = req.body;
    try {
      let createdAt = Date.now();
      let updatedAt = Date.now();

      const reservation = await Reservation.create({
        day,
        size,
        hours,
        master_id,
        towns_id,
        clientId,
        createdAt,
        updatedAt,
      });
      return res.json(reservation);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAvailable(req, res, next) {
    try {
      const { id } = req.params;
      let availability = await Reservation.findAll({
        where: { towns_id: id },
      });
      return res.json(availability);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  //Расчет подходящих мастеров
  async availableMasters(req, res, next) {
    return res.json(finaleMasters);
  }

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
  }
}

module.exports = new ReservationController();
