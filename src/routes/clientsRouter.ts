import * as clientsController from "../controllers/clientsController";
import * as express from "express";
const { clientDataValidate } = require("../middleware/validator");
const router: express.Router = express.Router();
import * as passport from "passport";
import { combinedMiddleware } from "../middleware/combinedMiddleware";

router.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  clientsController.getAll
);
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
    clientDataValidate,
  ],
  clientsController.create
);
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  clientsController.destroy
);
router.post("/registration", clientsController.registration);
router.put(
  "/changepassword",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  clientsController.changePassword
);
router.get(
  "/data",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["client"]),
  ],
  clientsController.clientsAccountData
);

module.exports = router;
