import * as passport from "passport";
import * as express from "express";
const router: express.Router = express.Router();
import * as townsController from "../controllers/townsController";
const { townDataValidator } = require("../middleware/validator");

router.get("/", townsController.getAll);
router.post(
  "/",
  [passport.authenticate("jwt", { session: false }), townDataValidator],
  townsController.create
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  townsController.destroy
);

module.exports = router;
