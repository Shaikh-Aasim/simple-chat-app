const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});


app.use(cors());
app.use(express.json());


const users = {
  aasim: "1234",
  nayab: "nayab",
};

// serve index.html on root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Login endpoint (Simple authentication)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password required" });
  }

  if (users[username] && users[username] === password) {
    console.log(`✅ Login success for user: ${username}`);
    return res.json({ success: true });
  }

  console.log(`❌ Invalid login attempt for user: ${username}`);
  return res
    .status(401)
    .json({ success: false, message: "Invalid username or password" });
});

io.on("connection", (socket) => {
  const username = socket.handshake.query.username || "Unknown";
  console.log(`🟢 ${username} connected (${socket.id})`);

  // Listen for chat messages
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg); // broadcast to everyone
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 ${username} disconnected (${socket.id})`);
  });
});

server.listen(3000, "0.0.0.0", () =>
  console.log("✅ Server running on https://simple-chat-app-l0fm.onrender.com")
);
