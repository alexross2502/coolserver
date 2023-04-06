import { Users, Clients } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";
import { passwordHash } from "../utils/passwordHash";
import {
  sendClientRegistrationCredentials,
  sendNewPassword,
} from "../utils/sendMail";
import { generateRandomPassword } from "../utils/generateRandomPassword";
import { createNewClient } from "../utils/createNewClient";

export async function create(req: express.Request, res: express.Response) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { name, email, password } = req.body;
    const client = await createNewClient(name, email, password);
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
    const client = await createNewClient(name, email, password);
    if (!client) throw new Error("error");
    sendClientRegistrationCredentials(email, name, password);
    return res.status(200).json(client).end();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function getAll(req: express.Request, res: express.Response) {
  const clients = await Clients.findAll();
  return res.status(200).json(clients).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const client = await Clients.findOne({ where: { id: id } });
    await client.destroy();
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
