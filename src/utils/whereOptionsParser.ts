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
    params.options.adminApprove = true;
  }
  return params.options;
}
