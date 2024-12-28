const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const PORT = config.get("port");
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");
const exHbs = require("express-handlebars");
const viewRouter = require("./routes/view.routes");

const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs", //handlebars
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("views"));

app.use("/", viewRouter); //frontend
app.use("/api", mainRouter); //backend

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
