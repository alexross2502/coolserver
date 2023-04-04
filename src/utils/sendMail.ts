import * as nodemailer from "nodemailer";
import { transporterCredentials } from "./constants";

let transporter = nodemailer.createTransport({
  ...transporterCredentials,
});

////Отправка письма
export async function sendMail(recipient, name, surname, rating) {
  try {
    let result = await transporter.sendMail({
      from: transporterCredentials.auth.user,
      to: recipient,
      subject: "Уведомление о резерве мастера",
      text: "This message was sent from Node js server.",
      html: `
        Вы успешно заказали мастера ${name} ${surname} с рейтингом ${rating} 
        `,
    });
  } catch (e) {
    console.log(e);
  }
}

////Отправка письма мастеру
export async function sendMaster(recipient, name, surname, password) {
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
export async function sendClient(recipient, name, password) {
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
