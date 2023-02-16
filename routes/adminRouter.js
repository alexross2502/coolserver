const Router = require("express");
const router = new Router();
const adminController = require("../controllers/adminController");

router.post("/", adminController.check);
router.post("/add", adminController.create);

module.exports = router;
