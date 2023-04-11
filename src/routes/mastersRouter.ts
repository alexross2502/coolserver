import * as express from "express";
const router: express.Router = express.Router();
import * as mastersController from "../controllers/mastersController";
const { masterDataValidate } = require("../middleware/validator");
const roleMiddleware = require('../middleware/roleMiddleware')

router.post(
  "/",
  [roleMiddleware(['admin']), masterDataValidate],
  mastersController.create
);
router.get(
  "/",
  roleMiddleware(['admin']),
  mastersController.getAll
);
router.delete(
  "/:id",
  roleMiddleware(['admin']),
  mastersController.destroy
);
router.post(
  "/registration",
  masterDataValidate,
  mastersController.registration
);
router.put(
  "/changepassword",
  roleMiddleware(['admin']),
  mastersController.changePassword
);
router.get("/data", roleMiddleware(['master']), mastersController.mastersAccountData)

module.exports = router;
