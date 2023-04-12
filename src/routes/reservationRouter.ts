import * as express from "express";
import passport = require("passport");
const router: express.Router = express.Router();
import * as reservationController from "../controllers/reservationController";
const { reservationDataValidator } = require("../middleware/validator");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  reservationController.getAll
);
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    roleMiddleware(["admin"]),
    reservationDataValidator,
  ],
  reservationController.create
);
router.delete(
  "/:id",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  reservationController.destroy
);
router.post("/order", reservationController.makeOrder);
router.post("/available", reservationController.availableMasters);

module.exports = router;
