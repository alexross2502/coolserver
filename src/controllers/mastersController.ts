import { Masters } from "../models/models";
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
    attributes: [
      "id",
      "name",
      "surname",
      "rating",
      "townId",
      "password",
      "email",
    ],
  });

  return res.status(200).json(masters).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  const { id } = req.params;
  const master = await Masters.destroy({ where: { id: id } });
  if (master) {
    return res.status(200).json(master).end();
  } else {
    return res.status(400).json({ message: "error" }).end();
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
    const { id, email } = req.body;
    let newPassword = generateRandomPassword();
    let hashedPassword = await passwordHash(newPassword);
    const master = await Masters.update(
      { password: hashedPassword },
      { where: { id } }
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
  return await createMaster(req, res, true);
}

export async function create(req: express.Request, res: express.Response) {
  return await createMaster(req, res, false);
}
