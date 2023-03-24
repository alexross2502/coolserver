import * as nodemailer from "nodemailer";
import { transporterCredentials } from "./constants";

////Отправка письма
export async function sendMail(recipient, name, surname, rating) {
  let transporter = nodemailer.createTransport({
    ...transporterCredentials,
  });

  let result = await transporter.sendMail({
    from: transporterCredentials.auth.user,
    to: recipient,
    subject: "Уведомление о резерве мастера",
    text: "This message was sent from Node js server.",
    html: `
      Вы успешно заказали мастера ${name} ${surname} с рейтингом ${rating} 
      `,
  });
}
