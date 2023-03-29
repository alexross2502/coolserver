import { Admin } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";
import { auth } from "../utils/auth";
import { passwordHash } from "../utils/passwordHash";

export async function check(req: express.Request, res: express.Response) {
  try {
    let { login, password } = req.body;
    let availability = await Admin.findOne({
      where: { email: login },
    });
    if (!!availability) {
      const authTokens = await auth.login(
        login,
        password,
        availability.dataValues.password
      );
      res.status(200).json(authTokens).end();
    } else {
      throw new Error("error");
    }
  } catch (e) {
    return res.status(400).json({ message: e }).end();
  }
}

export async function create(req: express.Request, res: express.Response) {
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error("Validator's error");
  }
  let { email, password } = req.body;
  let availability = await Admin.findOne({
    where: { email: email },
  });
  try {
    if (!availability) {
      let hashedPassword = await passwordHash(password)
      let createdAt = Date.now();
      let updatedAt = Date.now();
      let admin = await Admin.create({
        email,
        hashedPassword,
        createdAt,
        updatedAt,
      });
      if (admin) {
        return res.status(200).json(admin).end();
      } else {
        throw new Error("error");
      }
    } else {
      throw new Error("error");
    }
  } catch (e) {
    return res.status(400).json({ message: e }).end();
  }
}
