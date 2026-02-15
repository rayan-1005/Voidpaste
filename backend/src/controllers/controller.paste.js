import crypto from "crypto";
import supabase from "../config/supabase.js";

const generateId = async () => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (true) {
    let id = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      id += charset[randomIndex];
    }
    const { data, error } = await supabase
      .from("pastes")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("Database error:", error);
      continue; // Try again if there's an error
    }
    if (!data) {
      return id; // ID is unique, return it
    }
  }
};

const createPaste = async (req, res) => {
  const { content, expires_at, title } = req.body;

  if (!content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  const pasteId = await generateId();

  let expiresAt = null;
  if (expires_at) {
    expiresAt = new Date(Date.now() + expires_at * 1000).toISOString();
  }
  const { error } = await supabase.from("pastes").insert([
    {
      id: pasteId,
      content: content,
      expires_at: expiresAt,
      title: title || null,
    },
  ]);

  if (error) {
    console.error("Error inserting paste:", error);
    return res.status(500).json({ error: "Failed to create paste" });
  }
  res.json({
    pasteId,
    URL: `${req.protocol}://${req.get("host")}/paste/${pasteId}`,
  });
  console.log("Created paste:", pasteId);
};

const getPaste = async (req, res) => {
  const { id } = req.params;

  console.log("Looking for:", id);

  const { data, error } = await supabase
    .from("pastes")
    .select("content, created_at, expires_at, view_once, title")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching paste:", error);
    return res.status(500).json({ error: "Failed to fetch paste" });
  }

  if (!data) {
    return res.status(404).json({ error: "Paste not found" });
  }

  const now = new Date();
  if (data.expires_at && new Date(data.expires_at) < now) {
    const { error: deleteError } = await supabase
      .from("pastes")
      .delete()
      .eq("id", id);
    if (deleteError) {
      console.error("Error deleting expired paste:", deleteError);
    }
    return res.status(410).json({ error: "Paste has expired" });
  }

  if (data.view_once) {
    const { error: deleteError } = await supabase
      .from("pastes")
      .delete()
      .eq("id", id);
    if (deleteError) {
      console.error("Error deleting view-once paste:", deleteError);
    }
  }
  console.log("Fetched paste:", id);

  // This line decides behavior
  const acceptHeader = req.headers.accept || "";

  if (acceptHeader.includes("application/json")) {
    return res.json({
      content: data.content,
      title: data.title,
      created_at: data.created_at,
      expires_at: data.expires_at,
      view_once: data.view_once,
    });
  }

  // Curl / API request → return plain text
  res.type("text/plain").send(data.content);
};

const deleteExpiredPastes = async () => {
  const { error } = await supabase
    .from("pastes")
    .delete()
    .lt("expires_at", new Date().toISOString());
  if (error) {
    console.error("Error deleting expired pastes:", error);
    return;
  }
  console.log("Expired pastes deleted successfully");
};

const deletePaste = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("pastes").delete().eq("id", id);
  if (error) {
    console.error("Error deleting paste:", error);
    return res.status(500).json({ error: "Failed to delete paste" });
  }
  return res
    .status(200)
    .json({ message: "Paste deleted successfully", id: id });
};

export { createPaste, getPaste, deletePaste, deleteExpiredPastes };
