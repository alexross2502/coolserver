import * as express from "express";
import passport = require("passport");
const router: express.Router = express.Router();
import * as townsController from "../controllers/townsController";
import { combinedMiddleware } from "../middleware/combinedMiddleware";
const { townDataValidator } = require("../middleware/validator");

router.get("/", townsController.getAll);
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
    townDataValidator,
  ],
  townsController.create
);
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin"]),
  ],
  townsController.destroy
);

export default router;
