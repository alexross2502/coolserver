import { Clients } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";
import { passwordHash } from "../utils/passwordHash";
import { sendClientRegistrationCredentials } from "../utils/sendMail";

export async function createNewClient(
    req: express.Request,
    res: express.Response,
    sendCredentials: boolean = false
  ) {
    try {
      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        throw new Error("Validator's error");
      }
      const { name, email, password } = req.body;
      let hashedPassword = await passwordHash(password);
      let createdAt = Date.now();
      let updatedAt = Date.now();
      const client = await Clients.create({
        name,
        email,
        createdAt,
        updatedAt,
        password: hashedPassword,
      });
  
      if (sendCredentials) {
        sendClientRegistrationCredentials(email, name, password);
      }
  
      return res.status(200).json(client).end()
    } catch (e) {
      return res.status(400).json({message: e.message}).end()
    }
  }