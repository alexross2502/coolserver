const Router = require("express");
const router = new Router();
const adminRouter = require("./adminRouter");
const clientsRouter = require("./clientsRouter");
const mastersRouter = require("./mastersRouter");
const reservationRouter = require("./reservationRouter");
const townsRouter = require("./townsRouter");

router.use("/admin", adminRouter);
router.use("/clients", clientsRouter);
router.use("/masters", mastersRouter);
router.use("/reservation", reservationRouter);
router.use("/towns", townsRouter);

module.exports = router;
