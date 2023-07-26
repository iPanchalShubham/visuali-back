import express from "express";
import router from "./appRoute.js";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
dotenv.config({ path: "./config.env" });
const app = express();

app.use(express.json());
app.use(cors());
app.use(compression())
app.use("/video", router);

app.get("/", (req, res) => {
  res.json({ message: "Up and running", status: 200 });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`listening on port ${process.env.PORT || 8080}`);
});
