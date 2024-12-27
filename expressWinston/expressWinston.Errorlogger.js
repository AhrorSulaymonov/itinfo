const express = require("express");
const winston = require("winston");
const expressWinston = require("express-winston");

module.exports = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.json()),
});
