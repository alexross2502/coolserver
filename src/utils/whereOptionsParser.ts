export function whereOptionsParser(params) {
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
  if (params.sortedField && params.sortingOrder) {
    params.options.order.push([params.sortedField, params.sortingOrder]);
  }
  return params.options;
}
