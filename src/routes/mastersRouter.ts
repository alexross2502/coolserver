import * as express from "express";
const router: express.Router = express.Router();
import * as mastersController from "../controllers/mastersController";
const { masterDataValidate } = require("../middleware/validator");
import * as passport from "passport";
import { combinedMiddleware } from "../middleware/combinedMiddleware";

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
    masterDataValidate,
  ],
  mastersController.create
);
router.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  mastersController.getAll
);
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  mastersController.destroy
);
router.post(
  "/registration",
  masterDataValidate,
  mastersController.registration
);
router.put(
  "/changepassword",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  mastersController.changePassword
);
router.get(
  "/data",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["master"]),
  ],
  mastersController.mastersAccountData
);
router.put(
  "/approveaccount",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  mastersController.approveMasterAccount
);
router.get("/mailconfirmation/:id", mastersController.mailConfirmation);
router.put(
  "/changestatus",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["master", "admin"]),
  ],
  mastersController.changeReservationStatus
);

export default router;
