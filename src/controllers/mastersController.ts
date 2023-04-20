import { Users, Masters, Reservation, Clients } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";
import { passwordHash } from "../utils/passwordHash";
import {
  sendEmailConfirmation,
  sendMasterRegistrationCredentials,
  sendNewPassword,
} from "../utils/sendMail";
import { generateRandomPassword } from "../utils/generateRandomPassword";
import { createMaster } from "../utils/createNewMaster";
import { Op, Sequelize, where } from "sequelize";
import handlingTokenForEmailConfirmation from "../utils/handlingTokenForEmailConfirmation";
import createTokenForEmailConfirmation from "../utils/createTokenForEmailConfirmation";
import decodingToken from "../utils/decodingToken";
import { Iwhere } from "../interfaces/interfaces";

export async function getAll(req: express.Request, res: express.Response) {
  const masters = await Masters.findAll({ where: { mailConfirmation: true } });
  return res.status(200).json(masters).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const master = await Masters.findOne({ where: { id: id } });
    await Users.destroy({ where: { login: master.dataValues.email } });
    return res.status(200).json(master).end();
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
    const master = await Users.update(
      { password: hashedPassword },
      { where: { login: email } }
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
    const { name, surname, townId, password, email } = req.body;
    const master = await createMaster(
      name,
      surname,
      5,
      townId,
      email,
      password,
      false,
      false
    );
    if (!master) throw new Error("error");
    let token = createTokenForEmailConfirmation(master.id);
    sendEmailConfirmation(token, "masters", email);
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
      password,
      true,
      true
    );
    if (!master) throw new Error("error");
    return res.status(200).json().end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function mastersAccountData(req, res) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const masterId = req.user.id;
    const data = await Reservation.findAll({
      where: {
        master_id: masterId,
      },
      attributes: ["id", "size", "day", "end", "clientId", "price", "status"],
      include: {
        model: Clients,
        where: {
          id: Sequelize.col("reservations.clientId"),
        },
        attributes: ["name"],
      },
    });
    return res.status(200).json({ data }).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function approveMasterAccount(req, res) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { id } = req.body;
    await Masters.update({ adminApprove: true }, { where: { id } });
    return res.status(200).json().end();
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
    const masterId = decodingToken(req.headers.authorization);
    await Masters.update({ mailConfirmation: true }, { where: { id } });
    return res.status(200).json().end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function changeReservationStatus(
  req: express.Request,
  res: express.Response
) {
  try {
    const whereOptions: Iwhere = {};
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { id, status } = req.body;
    const token = decodingToken(req.headers.authorization);
    if (token.role === "master") {
      whereOptions.master_id = token.id;
    }
    const reservation = await Reservation.update(
      { status: status },
      { where: { id, end: { [Op.gt]: new Date() }, ...whereOptions } }
    );
    return res.status(200).json(reservation).end();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message }).end();
  }
}
