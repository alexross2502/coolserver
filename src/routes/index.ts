import * as express from "express";
import adminRouter from "./adminRouter";
import clientsRouter from "./clientsRouter";
import mastersRouter from "./mastersRouter";
import reservationRouter from "./reservationRouter";
import townsRouter from "./townsRouter";
import usersRouter from "./usersRouter";
const router: express.Router = express.Router();

router.use("/admin", adminRouter);
router.use("/clients", clientsRouter);
router.use("/masters", mastersRouter);
router.use("/reservation", reservationRouter);
router.use("/towns", townsRouter);
router.use("/users", usersRouter);

export default router;
