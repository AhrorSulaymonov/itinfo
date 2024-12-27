const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const PORT = config.get("port");
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");
const error_handling_middleware = require("./error_middleware/error_handling_middleware");
const logger = require("./services/logger.service");
const winston = require("winston");
const winstonLogger = require("./expressWinston/expressWinston.logger");
const winstonErrorLogger = require("./expressWinston/expressWinston.Errorlogger");
// require("dotenv").config({
//   path: `.env.${process.env.NODE_ENV}`,
// });

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));

// process.on("uncaughtException", (exception) => {
//   console.log("uncaughtException", exception.message);
// });

// process.on("unhandledRejection", (rejetion) => {
//   console.log("unhandledRejection", rejetion);
// });

logger.log("info", "Log ma'lumotlar");
logger.error("Error Ma'lumotlari");
logger.debug("Debug ma'lumotlar");
logger.warn("Warn ma'lumotlar");
logger.info("Info ma'lumotlar");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(winstonLogger);

app.use("/api", mainRouter);

app.use(winstonErrorLogger);

app.use(error_handling_middleware); //Error handling eng oxirida chaqiriladi

async function start() {
  try {
    await mongoose.connect(config.get("dbAtlasUri"));
    app.listen(PORT, () => {
      console.log(`server started at: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.log(error);
    console.log("Ma'lumotlar bazasiga ulanishda xatolik");
  }
}

start();
