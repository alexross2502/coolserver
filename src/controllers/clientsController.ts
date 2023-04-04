import { Clients } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";
import { passwordHash } from "../utils/passwordHash";
import { sendClient, sendNewPassword } from "../utils/sendMail";
import { randomPassword } from "../utils/randomPassword";

export async function create(req: express.Request, res: express.Response) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { name, email, password } = req.body;
    let hashedPassword = await passwordHash(password)
    let createdAt = Date.now();
    let updatedAt = Date.now();
    const client = await Clients.create({
      name,
      email,
      createdAt,
      updatedAt,
      password : hashedPassword
    });

    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: e }).end();
  }
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
    return res.status(400).json({ message: e }).end();
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
    let createdAt = Date.now();
    let updatedAt = Date.now();
    let hashedPassword = await passwordHash(password);
    const client = await Clients.create({
      name,
      email,
      createdAt,
      updatedAt,
      password : hashedPassword,
    });
    sendClient(email, name, password)
    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
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
    let newPassword = randomPassword()
    let hashedPassword = await passwordHash(newPassword) 
    const client = await Clients.update(
      { password: hashedPassword },
      { where: { id } }
    )
      sendNewPassword(email, newPassword)
    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: e }).end();
  }
}
