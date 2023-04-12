import * as express from "express";
import passport = require("passport");
const router: express.Router = express.Router();
import * as townsController from "../controllers/townsController";
const { townDataValidator } = require("../middleware/validator");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", townsController.getAll);
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    roleMiddleware(["admin"]),
    townDataValidator,
  ],
  townsController.create
);
router.delete(
  "/:id",
  [passport.authenticate("jwt", { session: false }), roleMiddleware(["admin"])],
  townsController.destroy
);

module.exports = router;
