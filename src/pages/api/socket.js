import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end()
  } else {
    console.log("Socket is initializing");
    global.Socket_IO = new Server(res.socket.server, { path: "/api/socket", addTrailingSlash: false });
    res.socket.server.io = global.Socket_IO;

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
  }
  res.end();
};

export default SocketHandler;
