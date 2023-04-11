import * as express from "express";
const router: express.Router = express.Router();
import * as townsController from "../controllers/townsController";
const { townDataValidator } = require("../middleware/validator");
const roleMiddleware = require('../middleware/roleMiddleware')

router.get("/", townsController.getAll);
router.post(
  "/",
  [roleMiddleware(['admin']), townDataValidator],
  townsController.create
);
router.delete(
  "/:id",
  roleMiddleware(['admin']),
  townsController.destroy
);

module.exports = router;
