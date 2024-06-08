//@ts-nocheck
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  //SocketIO.setInstance(httpServer);

  global.Socket_IO = new Server(httpServer, {
    path: "",
    addTrailingSlash: false,
    cors: {
      origin: "http://localhost:3000",
    },
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    },
  });

  global.Socket_IO.on("connection", async (socket) => {
    if (socket.recovered) {
      // recovery was successful: socket.id, socket.rooms and socket.data were restored
      console.log("(R) Client ID: " + socket.id);
    } else {
      // new or unrecoverable session
      console.log("(+) Client ID: " + socket.id);
    }

    socket.on("disconnect", () => {
      console.log("(-) Client ID: " + socket.id);
    });
  });

  global.Socket_IO.engine.on("connection_error", (err) => {
    console.log(err.req); // request object
    console.log(err.code); // error code
    console.log(err.message); // error message, for example "Session ID unknown"
    console.log(err.context); // additional information
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
