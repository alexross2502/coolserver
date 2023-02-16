const { Masters } = require("../models/Masters");
const { Reservation } = require("../models/Reservation");
const { Towns } = require("../models/Towns");

const Validator = {};

Validator.checkName = function nameCheck(el) {
  const regexName = /^[а-яА-я]+$/;

  if (regexName.test(el)) {
    return true;
  } else {
    return false;
  }
};

Validator.checkEmail = function emailCheck(el) {
  const regexEmail =
    /^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$/;

  if (regexEmail.test(el)) {
    return true;
  } else {
    return false;
  }
};

Validator.checkRating = function ratingCheck(el) {
  if (el >= 1 && el <= 5) {
    return true;
  } else {
    return false;
  }
};

Validator.dateChecker = function checkerDate(day, hours) {
  let d = new Date();
  let currentDay = String(d.getDate());
  let currentMonth = String(+d.getMonth() + 1);
  let currentYear = String(d.getFullYear());
  let currenthour = String(d.getHours())
  let currentTimestamp = Validator.dateConverter(currentDay, currentMonth, currentYear, currenthour)
  let date = day.split('.')
console.log(currentTimestamp, 'currentTimestamp')

  if (date[0][0] == 0) date[0] = date[0][1]
  if(Validator.dateConverter(date[0], date[1], date[2], hours.split('-')[0]) > +currentTimestamp) {
    return true
  }else {
    return false
  }
}

Validator.dateConverter = function converterData(day, month, year, hour) {
  if (Number(day)[0] == 0) Number(day) = Number(day)[1]
  console.log(year * 8760 + month * 730 + day * 24 + hour, 'necurrent')
   return (+year * 8760 + +month * 730 + +day * 24 + +hour)
 }

Validator.hoursChecker = function checkerHours(hours) {

  if(hours.split('-').length > 3 || (hours.split('-')[0] != +hours.split('-')[hours.split('-').length - 1] - Number((hours.split('-').length - 1)))) {
    return false
  } else {
    hours = hours.split('-')[0]
    if(hours >= 9 && hours <= 19) {
      return true
    } else {
      return false
    }
  }
  
}

Validator.checkTownForMaster = async function checkTownForMaster (townName) {
  let town = await Towns.findOne({
    where: { name: townName },
  });
  if(town != null) {
    return true
  } else {
    return false
  }
}

Validator.checkCreateReservation = async function checkCreateReservation (master_id, towns_id) {
  let master = await Masters.findOne({
    where: { id: master_id },
  });
  if(master != null) {
    let town = await Towns.findOne({
      where: { id: towns_id, name: master.dataValues.townName },
    });
    if(town != null) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
  
}

Validator.dateRange = function dateRange (date) {
  date = date.split('.').reverse()
  if(isNaN(+date[0]) || isNaN(+date[1]) || isNaN(+date[2])) {
    return false
  }
  date = date.join('-')
  const d = new Date(date);
  if(d != 'Invalid Date' && +date.split('-')[0] > 2020){
    return true
  } else {
    return false
  }
}

function checkInterval(reservationStart, reservationEnd, timeStart, timeEnd) {

  if (
    timeEnd > reservationStart && timeEnd <= reservationEnd ||
    timeStart >= reservationStart && timeStart < reservationEnd ||
    timeStart <= reservationStart && timeEnd >= reservationEnd
  ) {
    return false;
  } else {
    return true;
  }
}

Validator.sameTime = async function sameTime (day, hours, master_id) {
  let reservation = await Reservation.findAll({
    where: { master_id: master_id, day: day },
  });
  let availability = true;
  hours = hours.split('-')
  let timeStart = +hours[0]
  let timeEnd = +hours[hours.length - 1] + 1
  reservation.forEach((el) => {
    time = el.dataValues.hours.split('-')
    let reservationStart = +time[0]
    let reservationEnd = +time[time.length - 1] + 1
   if(checkInterval(reservationStart, reservationEnd, timeStart, timeEnd) == false) {
    availability = false
   }
  })
  return availability
}


module.exports = Validator;
