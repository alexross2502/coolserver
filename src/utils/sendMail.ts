import * as nodemailer from "nodemailer";
import { transporterCredentials } from "./constants";

let transporter = nodemailer.createTransport(transporterCredentials);

////Отправка письма
export async function sendClientOrderMail(
  recipient,
  name,
  surname,
  rating,
  day,
  size,
  townName
) {
  try {
    let result = await transporter.sendMail({
      from: transporterCredentials.auth.user,
      to: recipient,
      subject: "Уведомление о резерве мастера",
      text: "This message was sent from Node js server.",
      html: `
        Вы успешно заказали мастера ${name} ${surname} с рейтингом ${rating} на ${day} в городе: ${townName}. Размер часов - ${size.sizeTranslate}
        `,
    });
  } catch (e) {
    console.log(e);
  }
}

////Отправка письма мастеру
export async function sendMasterRegistrationCredentials(
  recipient,
  name,
  surname,
  password
) {
  try {
    let result = await transporter.sendMail({
      from: transporterCredentials.auth.user,
      to: recipient,
      subject: "Уведомление об регистрации",
      text: "This message was sent from Node js server.",
      html: `
        ${name} ${surname}, вы успешно зарегистрировались. Ваш пароль - ${password}, никому его не сообщайте
        `,
    });
  } catch (e) {
    console.log(e);
  }
}

////Отправка письма клиенту
export async function sendClientRegistrationCredentials(
  recipient,
  name,
  password
) {
  try {
    let result = await transporter.sendMail({
      from: transporterCredentials.auth.user,
      to: recipient,
      subject: "Уведомление об регистрации",
      text: "This message was sent from Node js server.",
      html: `
      ${name}, вы успешно зарегистрировались. Ваш логин - ${recipient}, ваш пароль - ${password}, никому его не сообщайте
        `,
    });
  } catch (e) {
    console.log(e);
  }
}

////Отправка нового пароля
export async function sendNewPassword(recipient, password) {
  try {
    let result = await transporter.sendMail({
      from: transporterCredentials.auth.user,
      to: recipient,
      subject: "Уведомление об регистрации",
      text: "This message was sent from Node js server.",
      html: `
      Ваш логин - ${recipient}, ваш новый пароль - ${password}, никому его не сообщайте
        `,
    });
  } catch (e) {
    console.log(e);
  }
}
