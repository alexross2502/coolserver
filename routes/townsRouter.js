const Router = require("express");
const router = new Router();
const townsController = require("../controllers/townsController");
const passport = require("passport");
const { townDataValidator } = require("../middleware/validator");

router.get("/", townsController.getAll);
router.post(
  "/",
  [passport.authenticate("jwt", { session: false }), townDataValidator],
  townsController.create
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  townsController.destroy
);

module.exports = router;
