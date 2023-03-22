import * as express from "express";
const adminRouter = require("./adminRouter");
const clientsRouter = require("./clientsRouter");
const mastersRouter = require("./mastersRouter");
const reservationRouter = require("./reservationRouter");
const townsRouter = require("./townsRouter");
const router: express.Router = express.Router();

router.use("/admin", adminRouter);
router.use("/clients", clientsRouter);
router.use("/masters", mastersRouter);
router.use("/reservation", reservationRouter);
router.use("/towns", townsRouter);

export default router;
