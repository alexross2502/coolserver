const Router = require("express");
const router = new Router();
const reservationController = require("../controllers/reservationController");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  reservationController.getAll
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  reservationController.create
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  reservationController.destroy
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  reservationController.getAvailable
);
router.post("/order", reservationController.makeOrder);
router.post("/available", reservationController.availableMasters);

module.exports = router;
