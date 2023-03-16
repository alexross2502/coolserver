const Router = require("express");
const router = new Router();
const clientsController = require("../controllers/clientsController");
const passport = require("passport");
const { clientDataValidate } = require("../middleware/validator");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  clientsController.getAll
);
router.post(
  "/",
  [passport.authenticate("jwt", { session: false }), clientDataValidate],
  clientsController.create
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  clientsController.destroy
);

module.exports = router;
