import * as express from "express";
import passport = require("passport");
import * as usersController from "../controllers/usersController";
import { combinedMiddleware } from "../middleware/combinedMiddleware";

const router: express.Router = express.Router();
router.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    combinedMiddleware(["admin", "master", "client"]),
  ],
  usersController.currentUser
);

export default router;
