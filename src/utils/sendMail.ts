import * as nodemailer from "nodemailer";

////Отправка письма
export async function sendMail(recipient, name, surname, rating) {
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
