import * as express from "express";
import passport = require("passport");
import * as usersController from "../controllers/usersController";
import { combinedMiddleware } from "../middleware/combinedMiddleware";

const router: express.Router = express.Router();
router.get("/", usersController.currentUser);

export default router;
