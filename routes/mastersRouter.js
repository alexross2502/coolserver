const Router = require("express");
const router = new Router();
const mastersController = require("../controllers/mastersController");
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  mastersController.create
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  mastersController.getAll
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  mastersController.destroy
);
router.get(
  "/:name",
  passport.authenticate("jwt", { session: false }),
  mastersController.getAvailable
);

module.exports = router;
