const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const socketio = require("socket.io")(httpServer, {
  origins: "*",
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeader: "*",
  cors: { origin: "*" },
});

require("./src/database");
require("./src/socket.io")(socketio);

morgan = require("morgan");

app.set("port", process.env.PORT || 4000);

app.use(
  fileUpload({
    tempFileDir: "/temp",
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

//routes

app.use("/api/users", require("./routes/users"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/messages", require("./routes/messages"));

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

async function main() {
  await httpServer.listen(app.get("port"));
  console.log("server on port ", app.get("port"));
}

main();
