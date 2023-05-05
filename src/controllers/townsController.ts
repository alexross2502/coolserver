import * as expressValidator from "express-validator";
import { Towns, TownsWhereOptions } from "../models/Towns";
import * as express from "express";
import { requestOptionsParser } from "../utils/requestOptionsParser";

export async function create(req: express.Request, res: express.Response) {
  try {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Validator's error");
    }
    const { name, tariff } = req.body;

    let createdAt = Date.now();
    let updatedAt = Date.now();
    const town = await Towns.create({
      name: name,
      tariff: tariff,
    });
    return res.status(200).json(town).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function getAll(req: express.Request, res: express.Response) {
  try {
    const options: TownsWhereOptions = { where: {}, order: [] };
    const { offset, limit, sortedField, sortingOrder } = req.query;
    const total = await Towns.count();
    const towns = await Towns.findAll(
      requestOptionsParser({
        options,
        limit,
        offset,
        sortedField,
        sortingOrder,
      })
    );
    return res.status(200).json({ data: towns, total }).end();
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}

export async function destroy(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const towns = await Towns.destroy({ where: { id: id } });
    if (towns) {
      return res.status(200).json(towns).end();
    } else {
      throw new Error("error");
    }
  } catch (e) {
    return res.status(400).json({ message: e.message }).end();
  }
}
