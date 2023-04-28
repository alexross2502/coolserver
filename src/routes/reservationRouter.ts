import * as express from "express";
import passport = require("passport");
const router: express.Router = express.Router();
import * as reservationController from "../controllers/reservationController";
import { combinedMiddleware } from "../middleware/combinedMiddleware";
const { reservationDataValidator } = require("../middleware/validator");

router.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  reservationController.getAll
);
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
    reservationDataValidator,
  ],
  reservationController.create
);
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  reservationController.destroy
);
router.post("/order", reservationController.makeOrder);
router.post("/available", reservationController.availableMasters);
router.post(
  "/images",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  reservationController.getAllImages
);

module.exports = router;
