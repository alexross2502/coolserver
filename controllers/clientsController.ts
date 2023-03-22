import { Clients } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";

export async function create(req: express.Request, res: express.Response) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, email } = req.body;
    let createdAt = Date.now();
    let updatedAt = Date.now();
    const client = await Clients.create({
      name,
      email,
      createdAt,
      updatedAt,
    });

    return res.status(200).json(client).end();
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
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
      return res.status(400).json({ message: "wrong data" }).end();
    }
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
  }
}
