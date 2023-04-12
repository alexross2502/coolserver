import * as clientsController from "../controllers/clientsController";
import * as express from "express";
const { clientDataValidate } = require("../middleware/validator");
const router: express.Router = express.Router();
const roleMiddleware = require("../middleware/roleMiddleware");
import * as passport from "passport";

router.get(
  "/",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  clientsController.getAll
);
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    roleMiddleware(["admin"]),
    clientDataValidate,
  ],
  clientsController.create
);
router.delete(
  "/:id",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  clientsController.destroy
);
router.post("/registration", clientsController.registration);
router.put(
  "/changepassword",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  clientsController.changePassword
);
router.get(
  "/data",
  [
    passport.authenticate("jwt", { session: false }),
    roleMiddleware(["client"]),
  ],
  clientsController.clientsAccountData
);

module.exports = router;
