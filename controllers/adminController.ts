import { Admin } from "../models/models";
const jwt = require("jsonwebtoken");
import * as expressValidator from "express-validator";
const bcrypt = require("bcrypt");
import * as express from "express";

export async function check(req: express.Request, res: express.Response) {
  try {
    let { login, password } = req.body;
    let token = "secret";
    let availability = await Admin.findOne({
      where: { email: login },
    });
    if (!!availability) {
      bcrypt.compare(
        password,
        availability.dataValues.password,
        (err, result) => {
          if (result) {
            token = jwt.sign(
              {
                login: login,
              },
              "dev-jwt",
              { expiresIn: 60 * 60 * 3 }
            );
            return res
              .status(200)
              .json({
                availability: true,
                token: `Bearer ${token}`,
              })
              .end();
          } else {
            return res.status(400).json({ message: "wrong password" }).end();
          }
        }
      );
    } else {
      return res.status(400).json({ message: "wrong login" }).end();
    }
  } catch (e) {
    return res.status(400).json({ message: e }).end();
  }
}

export async function create(req: express.Request, res: express.Response) {
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  let { email, password } = req.body;
  let availability = await Admin.findOne({
    where: { email: email },
  });
  try {
    if (!availability) {
      const salt = await bcrypt.genSalt(3);
      password = await bcrypt.hash(password, salt);
      let createdAt = Date.now();
      let updatedAt = Date.now();
      let admin = await Admin.create({
        email,
        password,
        createdAt,
        updatedAt,
      });
      if (admin) {
        return res.status(200).json(admin).end();
      } else {
        return res.status(400).json({ message: "error" }).end();
      }
    } else {
      return res.status(400).json({ message: "wrong login" }).end();
    }
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
  }
}
