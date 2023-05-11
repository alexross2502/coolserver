import { Op } from "sequelize";
import sequelize from "../db";

export function requestOptionsParser(params) {
  if (params.limit) {
    params.options.limit = +params.limit;
  }
  if (params.offset) {
    params.options.offset = +params.offset;
  }
  if (params.mailConfirmation) {
    params.options.where.mailConfirmation = true;
  }
  if (params.adminApprove) {
    params.options.where.adminApprove = true;
  }
  if (params.master) {
    params.options.where.master_id = params.master;
  }
  if (params.town) {
    params.options.where.towns_id = params.town;
  }
  if (params.status) {
    params.options.where.status = params.status;
  }
  if (params.start) {
    params.options.where.day = {
      [Op.gt]: params.start,
    };
  }
  if (params.end) {
    params.options.where.end = {
      [Op.lt]: params.end,
    };
  }
  if (
    params.sortedField &&
    ["towns", "masters", "clients"].includes(params.sortedField)
  ) {
    const sortedModel = sequelize.model(params.sortedField);
    params.options.order.push([sortedModel, "name", params.sortingOrder]);
    params.options.include.push({ model: sortedModel });
    return params.options;
  }
  if (params.sortedField && params.sortingOrder) {
    params.options.order.push([params.sortedField, params.sortingOrder]);
  }
  return params.options;
}
