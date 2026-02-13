import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
  res.send("Hello, Voidpaste!");
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

export default server;
