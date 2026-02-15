import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

import router from "./routes/routes.paste.js";
import { deleteExpiredPastes } from "./controllers/controller.paste.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// mount paste routes
app.use("/paste", router);

app.use(express.static(path.resolve("../frontend")));

app.get("/view/:id", (req, res) => {
  res.sendFile(path.resolve("../frontend/view.html"));
});

app.get("/", (req, res) => {
  res.redirect("/new.html");
});

app.get("/paste/:id", async (req, res) => {
  const pasteId = req.params.id;

  const accept = req.headers.accept || "";

  // If browser, serve HTML viewer
  if (accept.includes("text/html")) {
    return res.sendFile(path.resolve("../frontend/view.html"));
  }

  // If curl or API, serve raw text
  const { data } = await supabase
    .from("pastes")
    .select("content")
    .eq("id", pasteId)
    .single();

  if (!data) {
    return res.status(404).send("Paste not found");
  }

  res.type("text/plain").send(data.content);
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setInterval(() => {
  deleteExpiredPastes();
}, 60000 * 5); // Run every 5 minute
