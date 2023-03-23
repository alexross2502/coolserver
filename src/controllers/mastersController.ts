import { Masters } from "../models/models";
import * as expressValidator from "express-validator";
import * as express from "express";

export async function create(req: express.Request, res: express.Response) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { name, surname, rating, townId } = req.body;

    let createdAt = Date.now();
    let updatedAt = Date.now();
    const master = await Masters.create({
      name,
      surname,
      rating,
      townId,
      createdAt,
      updatedAt,
    });
    return res.status(200).json(master).end();
  } catch (e) {
    return res.status(400).json({ message: "error" }).end();
  }
}

export async function getAll(req: express.Request, res: express.Response) {
  const masters = await Masters.findAll({
    attributes: ["id", "name", "surname", "rating", "townId"],
  });

  return res.status(200).json(masters).end();
}

export async function destroy(req: express.Request, res: express.Response) {
  const { id } = req.params;
  const master = await Masters.destroy({ where: { id: id } });
  if (master) {
    return res.status(200).json(master).end();
  } else {
    return res.status(400).json({ message: "wrong data" }).end();
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
