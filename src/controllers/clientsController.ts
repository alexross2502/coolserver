import { Clients } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";
import { passwordHash } from "../utils/passwordHash";
import {
  sendClientRegistrationCredentials,
  sendNewPassword,
} from "../utils/sendMail";
import { generateRandomPassword } from "../utils/generateRandomPassword";
import { createNewClient } from "../utils/createNewClient";

export async function registration(
  req: express.Request,
  res: express.Response
) {
  return await createNewClient(req, res, true);
}

export async function create(req: express.Request, res: express.Response) {
  return await createNewClient(req, res, false);
}

export async function getAll(req: express.Request, res: express.Response) {
  const clients = await Clients.findAll();
  return res.status(200).json(clients).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const client = await Clients.destroy({ where: { id: id } });
    if (client) {
      return res.status(200).json(client).end();
    } else {
      throw new Error("error");
    }
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
    const { id, email } = req.body;
    let newPassword = generateRandomPassword();
    let hashedPassword = await passwordHash(newPassword);
    const client = await Clients.update(
      { password: hashedPassword },
      { where: { id } }
    );
    await sendNewPassword(email, newPassword);
    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}
