const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(cors({
  origin: "https://eventmanagementtanmay.netlify.app/", // Replace with your Netlify URL
  credentials: true
}));
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

// WebSocket for real-time updates
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("newEvent", (event) => {
    io.emit("eventCreated", event);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
