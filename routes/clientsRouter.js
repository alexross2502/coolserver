const Router = require("express");
const router = new Router();
const clientsController = require("../controllers/clientsController");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  clientsController.getAll
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  clientsController.create
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  clientsController.destroy
);

module.exports = router;
