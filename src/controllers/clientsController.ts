import { Users, Clients, Reservation, Masters } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";
import { passwordHash } from "../utils/passwordHash";
import {
  sendClientRegistrationCredentials,
  sendEmailConfirmation,
  sendNewPassword,
} from "../utils/sendMail";
import { generateRandomPassword } from "../utils/generateRandomPassword";
import { createNewClient } from "../utils/createNewClient";
import { Sequelize } from "sequelize";
import handlingTokenForEmailConfirmation from "../utils/handlingTokenForEmailConfirmation";
import createTokenForEmailConfirmation from "../utils/createTokenForEmailConfirmation";
import { ClientsWhereOptions } from "../models/Clients";
import { whereOptionsParser } from "../utils/whereOptionsParser";

export async function create(req: express.Request, res: express.Response) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { name, email, password } = req.body;
    const client = await createNewClient(name, email, password, true);
    if (!client) throw new Error("error");
    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function registration(
  req: express.Request,
  res: express.Response
) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { name, email, password } = req.body;
    const client = await createNewClient(name, email, password, false);
    if (!client) throw new Error("error");
    let token = createTokenForEmailConfirmation(client.id);
    sendEmailConfirmation(token, "clients", email);
    sendClientRegistrationCredentials(email, name, password);
    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function getAll(req: express.Request, res: express.Response) {
  const options: ClientsWhereOptions = { where: {}, order: [] };
  const { mailConfirmation, limit, offset, sortedField, sortingOrder } =
    req.query;
  const total = await Clients.count();
  const clients = await Clients.findAll(
    whereOptionsParser({
      options,
      mailConfirmation,
      limit,
      offset,
      sortedField,
      sortingOrder,
    })
  );
  return res.status(200).json({ data: clients, total }).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const client = await Clients.findOne({ where: { id: id } });
    await Users.destroy({ where: { login: client.dataValues.email } });
    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function changePassword(
  req: express.Request,
  res: express.Response
) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { email } = req.body;
    let newPassword = generateRandomPassword();
    let hashedPassword = await passwordHash(newPassword);
    const client = await Users.update(
      { password: hashedPassword },
      { where: { login: email } }
    );
    await sendNewPassword(email, newPassword);
    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function clientsAccountData(req, res) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const clientId = req.user.id;
    const data = await Reservation.findAll({
      where: {
        clientId: clientId,
      },
      attributes: ["id", "size", "day", "end", "master_id", "price"],
      include: {
        model: Masters,
        where: {
          id: Sequelize.col("reservations.master_id"),
        },
        attributes: ["name"],
      },
    });

    return res.status(200).json({ data }).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function mailConfirmation(
  req: express.Request,
  res: express.Response
) {
  try {
    const id = handlingTokenForEmailConfirmation(req.params.id);
    if (!id) throw new Error("error");
    await Clients.update({ mailConfirmation: true }, { where: { id } });
    return res.status(200).json(true).end();
  } catch (e) {
    return res.status(400).json().end();
  }
}
