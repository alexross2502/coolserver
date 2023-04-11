import * as express from "express";
const router: express.Router = express.Router();
import * as reservationController from "../controllers/reservationController";
const { reservationDataValidator } = require("../middleware/validator");
const roleMiddleware = require('../middleware/roleMiddleware')

router.get(
  "/",
  roleMiddleware(['admin']),
  reservationController.getAll
);
router.post(
  "/",
  [roleMiddleware(['admin']), reservationDataValidator],
  reservationController.create
);
router.delete(
  "/:id",
  roleMiddleware(['admin']),
  reservationController.destroy
);
router.post("/order", reservationController.makeOrder);
router.post("/available", reservationController.availableMasters);

module.exports = router;
