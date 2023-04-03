import * as passport from "passport";
import * as express from "express";
const router: express.Router = express.Router();
import * as mastersController from "../controllers/mastersController";
const { masterDataValidate } = require("../middleware/validator");

router.post(
  "/",
  [passport.authenticate("jwt", { session: false }), masterDataValidate],
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
router.post("/registration", mastersController.registration)

module.exports = router;
