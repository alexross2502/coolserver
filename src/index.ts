import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as passport from "passport";
import sequelize from "./db";
import router from "./routes/index";
import dbCredentials from "./config/config";
console.log(dbCredentials);
dotenv.config();

const app: express.Express = express();
const PORT: number | string = process.env.PORT || 3306;

app.use(
  cors({
    origin: "*",
  })
);

app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(express.json());
app.use("/api", router);

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: "working" });
});

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log("start", PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
