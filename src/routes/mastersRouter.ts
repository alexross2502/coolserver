import * as express from "express";
const router: express.Router = express.Router();
import * as mastersController from "../controllers/mastersController";
const { masterDataValidate } = require("../middleware/validator");
const roleMiddleware = require("../middleware/roleMiddleware");
import * as passport from "passport";

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    roleMiddleware(["admin"]),
    masterDataValidate,
  ],
  mastersController.create
);
router.get(
  "/",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  mastersController.getAll
);
router.delete(
  "/:id",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  mastersController.destroy
);
router.post(
  "/registration",
  masterDataValidate,
  mastersController.registration
);
router.put(
  "/changepassword",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  mastersController.changePassword
);
router.get(
  "/data",
  [
    passport.authenticate("jwt", { session: false }),
    roleMiddleware(["master"]),
  ],
  mastersController.mastersAccountData
);

module.exports = router;
