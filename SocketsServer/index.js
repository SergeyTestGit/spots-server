const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const configs = require("./Configs/server");

const corsMiddleware = require("./Middlewares/cors.middleware");
const errorHandlerMiddleware = require("./Middlewares/errorHandler.middleware");

const { initSocket } = require("./socket");

const app = express();
const server = require("http").Server(app);

// apply middleware
const storage = multer.memoryStorage();
const upload = multer({
  storage
});

app.use(
  bodyParser.json({
    type: "application/json",
    limit: "50mb"
  })
);
app.use(corsMiddleware);
app.use(require("./Middlewares/queryStart"));

require("./Libs/Dynamoose.lib"); // configure dynamoose

// server start
server.listen(configs.http.port, () => {
  initSocket(server);

  app.post("/chat/voice-message", upload.single('file'), require("./Handlers/Chat/Voice"));
  app.get("/chat-list", require("./Handlers/Chat/getChatsList"));
  app.post("/chat/connect", require("./Handlers/Chat/Connect"));
  app.put("/chat/block", require("./Handlers/Chat/Block"));
  app.get("/notification/list", require("./Handlers/Notfications/getList"));
  app.post(
    "/notification",
    require("./Handlers/Notfications/SendNotification")
  );
  app.post(
    "/notification/mark-as-read",
    require("./Handlers/Notfications/markAsRead")
  );
  app.get("/track/list", require("./Handlers/Track/GetList"));

  app.use(errorHandlerMiddleware);

  console.log("server starts at port ", configs.http.port);
});
