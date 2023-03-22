import * as passport from "passport";
import * as express from "express";
const router: express.Router = express.Router();
import * as reservationController from "../controllers/reservationController";
const { reservationDataValidator } = require("../middleware/validator");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  reservationController.getAll
);
router.post(
  "/",
  [passport.authenticate("jwt", { session: false }), reservationDataValidator],
  reservationController.create
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  reservationController.destroy
);
router.post("/order", reservationController.makeOrder);
router.post("/available", reservationController.availableMasters);

module.exports = router;
