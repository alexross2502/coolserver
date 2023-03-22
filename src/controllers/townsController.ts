import * as expressValidator from "express-validator";
import { Towns } from "../models/Towns";
import * as express from "express";

export async function create(req: express.Request, res: express.Response) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name } = req.body;

    let createdAt = Date.now();
    let updatedAt = Date.now();
    const town = await Towns.create({
      name: name,
    });
    return res.status(200).json(town).end();
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
  }
}

export async function getAll(req: express.Request, res: express.Response) {
  const towns = await Towns.findAll();
  return res.status(200).json(towns).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  const { id } = req.params;
  const towns = await Towns.destroy({ where: { id: id } });
  if (towns) {
    return res.status(200).json(towns).end();
  } else {
    return res.status(400).json({ message: "wrong data" }).end();
  }
}
