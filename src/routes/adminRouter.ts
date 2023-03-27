import * as express from "express";
import * as adminController from "../controllers/adminController";
import { adminDataValidate } from "../middleware/validator";

const router: express.Router = express.Router();
router.post("/", adminController.check);
router.post("/add", adminDataValidate, adminController.create);

module.exports = router;
