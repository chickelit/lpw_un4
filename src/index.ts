import dotenv from "dotenv";

dotenv.config();

import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { dataSource } from "./database/data-source";
import { express_async_errors_middleware } from "./middleware/express_async_errors_middleware";
import { router } from "./routes";

const app = express();
const port = +process.env.PORT!;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);
app.use(express_async_errors_middleware);

app.listen(port, async () => {
  try {
    await dataSource.initialize();

    console.log(`Server listening on port: ${port}`);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
});
