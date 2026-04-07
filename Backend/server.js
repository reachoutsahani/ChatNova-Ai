const http = require("http");
const dotenv = require("dotenv");

const connectDB = require("./src/db/db");
const { initSocketServer } = require("./src/socket/socket.server");

// 👇 IMPORTANT (app import karna hai, naya express nahi banana)
const app = require("./src/app");

dotenv.config();

// server create
const server = http.createServer(app);

// DB connect
connectDB();

// Socket init
initSocketServer(server);

// start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});