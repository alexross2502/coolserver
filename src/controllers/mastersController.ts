import { Access, Masters } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";
import { passwordHash } from "../utils/passwordHash";
import {
  sendMasterRegistrationCredentials,
  sendNewPassword,
} from "../utils/sendMail";
import { generateRandomPassword } from "../utils/generateRandomPassword";
import { createMaster } from "../utils/createNewMaster";

export async function getAll(req: express.Request, res: express.Response) {
  const masters = await Masters.findAll({
    attributes: ["id", "name", "surname", "rating", "townId", "email"],
  });

  return res.status(200).json(masters).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const master = await Masters.findOne({ where: { id: id } });
    await Access.destroy({ where: { email: master.dataValues.email } });
    await master.destroy();
    return res.status(200).json(master).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function getAvailable(
  req: express.Request,
  res: express.Response
) {
  const { name } = req.params;
  const master = await Masters.findAll({ where: { townName: name } });
  return res.json(master);
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
    const master = await Access.update(
      { password: hashedPassword },
      { where: { email } }
    );
    sendNewPassword(email, newPassword);
    return res.status(200).json(master).end();
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
    const { name, surname, rating, townId, password, email } = req.body;
    const master = await createMaster(
      name,
      surname,
      rating,
      townId,
      email,
      password
    );
    if (!master) throw new Error("error");
    sendMasterRegistrationCredentials(email, name, surname, password);
    return res.status(200).json().end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function create(req: express.Request, res: express.Response) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { name, surname, rating, townId, password, email } = req.body;
    const master = await createMaster(
      name,
      surname,
      rating,
      townId,
      email,
      password
    );
    if (!master) throw new Error("error");
    return res.status(200).json().end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}
