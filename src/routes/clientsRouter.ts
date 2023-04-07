import * as clientsController from "../controllers/clientsController";
import * as passport from "passport";
import * as express from "express";
const { clientDataValidate } = require("../middleware/validator");
const router: express.Router = express.Router();

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
router.post("/registration", clientsController.registration);
router.put(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  clientsController.changePassword
);

module.exports = router;
