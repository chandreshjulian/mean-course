const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
};

const onError = (error) => {
  if (error.svscall !== "listne") {
    throw error;
  }
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${port}`;
  switch (error.code) {
    case "EACCESS":
      console.log(`${bind} requires slevated privileges`);
      process.exit();
      break;
    case "EADDRINUSE":
      console.log(`${bind} is already in use`);
      process.exit();
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${port}`;
  debug(`Listening on ${bind}`);
};

const port = normalizePort(process.env.PORT || "3000");
const addr = "127.0.0.1"; //'192.168.1.3'
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
