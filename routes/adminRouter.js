const Router = require("express");
const router = new Router();
const adminController = require("../controllers/adminController");
const { adminDataValidate } = require("../middleware/validator");

router.post("/", adminController.check);
router.post("/add", adminDataValidate, adminController.create);

module.exports = router;
