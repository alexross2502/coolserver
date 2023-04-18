////// Настройки для размера часов
import { TransportOptions } from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");

export const timeSize = {
  small: 1,
  medium: 3,
  large: 5,
};

export const sizeTranslate = {
  small: "маленький",
  medium: "средний",
  large: "большой",
};

export const transporterCredentials = {
  host: process.env.POST_HOST,
  auth: {
    user: process.env.POST_EMAIL,
    pass: process.env.POST_PASSWORD,
  },
};

export const passwordChars =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const apiUrl = process.env.API_URL;
