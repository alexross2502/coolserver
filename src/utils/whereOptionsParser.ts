import sequelize from "../db";

export function whereOptionsParser(params) {
  if (params.limit) {
    params.options.limit = +params.limit;
  }
  if (params.offset) {
    params.options.offset = +params.offset;
  }
  if (params.mailConfirmation) {
    params.options.mailConfirmation = true;
  }
  if (params.adminApprove) {
    params.options.where.adminApprove = true;
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
