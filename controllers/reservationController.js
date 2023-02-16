const { Reservation, Masters, Clients } = require("../models/models");
const ApiError = require("../error/ApiError");
const nodemailer = require("nodemailer");
const Validator = require("../middleware/validator");

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
    const reservation = await Reservation.findAll();
    return res.json(reservation);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const reservation = await Reservation.destroy({ where: { id: id } });
    return res.json(reservation);
  }

  async create(req, res, next) {
    const { day, hours, master_id, towns_id } = req.body;
    if (
      Validator.dateChecker(day, hours) &&
      Validator.hoursChecker(hours) &&
      (await Validator.checkCreateReservation(master_id, towns_id)) &&
      Validator.dateRange(day) &&
      (await Validator.sameTime(day, hours, master_id))
    ) {
      try {
        const reservation = await Reservation.create({
          day,
          hours,
          master_id,
          towns_id,
        });
        return res.json(reservation);
      } catch (e) {
        next(ApiError.badRequest(e.message));
      }
    } else return res.json("Неверные данные");
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
    const { town, date, townName } = req.body;

    let includingTowns = await Reservation.findAll({
      where: { towns_id: town },
    });

    let includingReservation = includingTowns.filter(
      (el) => el.day == date.date
    ); //Ищет только резервы на конкретный день заказа

    let includingMasters = await Masters.findAll({
      where: { townName: townName },
    });
    //Берет всех мастеров с этого города

    let finaleMastersIndex = [];
    let temporary = {};
    includingMasters.forEach((el) => {
      finaleMastersIndex.push(el.id);
      temporary[el.id] = {
        id: el.id,
        name: el.name,
        surname: el.surname,
        rating: el.rating,
      };
    });

    let timeStart = date.time[0];
    let timeEnd = date.time[1];

    function checkInterval(
      reservationStart,
      reservationEnd,
      timeStart,
      timeEnd
    ) {
      reservationEnd = +reservationEnd + 1;
      timeEnd = +timeEnd + 1;
      if (
        (timeEnd > reservationStart && timeEnd <= reservationEnd) ||
        (timeStart >= reservationStart && timeStart < reservationEnd) ||
        (timeStart <= reservationStart && timeEnd >= reservationEnd)
      ) {
        return false;
      } else return true;
    }

    if (includingReservation.length !== 0) {
      includingReservation.forEach((el) => {
        el.hours = el.hours.split("-");
        if (
          !checkInterval(el.hours[0], el.hours.slice(-1), timeStart, timeEnd)
        ) {
          if (finaleMastersIndex.indexOf(el.master_id) !== -1) {
            finaleMastersIndex.splice(
              finaleMastersIndex.indexOf(el.master_id),
              1
            );
          }
        }
      });
    }

    let finaleMasters = [];
    finaleMastersIndex.forEach((el) => {
      finaleMasters.push(temporary[el]);
    });

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
        const reservation = await Reservation.create({
          day,
          hours,
          master_id,
          towns_id,
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
