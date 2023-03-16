const { body, param } = require("express-validator");

const clientDataValidate = [
  body("name")
    .exists()
    .withMessage("Name required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email")
    .exists()
    .withMessage("Email required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Email wrong format"),
];

const adminDataValidate = [
  body("login")
    .exists()
    .withMessage("Login required")
    .isString()
    .withMessage("Login must be a string")
    .isEmail()
    .withMessage("Login wrong format"),
  body("password")
    .exists()
    .withMessage("Password required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

const masterDataValidate = [
  body("name")
    .exists()
    .withMessage("Name required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("surname")
    .exists()
    .withMessage("Surname required")
    .isString()
    .withMessage("Surname must be a string")
    .isLength({ min: 3 })
    .withMessage("Surname must be at least 3 characters long"),
  body("rating")
    .exists()
    .withMessage("Rating required")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isInt({ min: 1, max: 5 })
    .withMessage("Master rating must be in range 1-5"),
  body("townId")
    .exists()
    .withMessage("Town required")
    .isString()
    .withMessage("Town must be a string"),
];

const townDataValidator = [
  body("name")
    .exists()
    .withMessage("Name required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
];

const reservationDataValidator = [
  body("day")
    .exists()
    .withMessage("Day required")
    .isNumeric()
    .withMessage("Day must be a number")
    .custom((date, { req }) => {
      const now = Date.now();
      if (date < now) throw new Error("Order for the past is prohibited");
      return true;
    }),
  body("size")
    .exists()
    .withMessage("Size required")
    .isString()
    .withMessage("Size must be a string")
    .isIn(["small", "medium", "large"])
    .withMessage("Unknown size"),
  body("master_id").exists().withMessage("master_id required"),
  body("towns_id").exists().withMessage("towns_id required"),
  body("clientId").exists().withMessage("clientId required"),
];

module.exports = {
  clientDataValidate,
  adminDataValidate,
  masterDataValidate,
  townDataValidator,
  reservationDataValidator,
};
