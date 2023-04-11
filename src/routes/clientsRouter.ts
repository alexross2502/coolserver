import * as clientsController from "../controllers/clientsController";
import * as express from "express";
const { clientDataValidate } = require("../middleware/validator");
const router: express.Router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware')

router.get(
  "/",
  roleMiddleware(['admin']),
  clientsController.getAll
);
router.post(
  "/",
  [roleMiddleware(['admin']), clientDataValidate],
  clientsController.create
);
router.delete(
  "/:id",
  roleMiddleware(['admin']),
  clientsController.destroy
);
router.post("/registration", clientsController.registration);
router.put(
  "/changepassword",
  roleMiddleware(['admin']),
  clientsController.changePassword
);
router.get("/data", roleMiddleware(['client']), clientsController.clientsAccountData)

module.exports = router;
